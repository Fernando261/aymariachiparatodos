-- Initial secure schema for Ay! Mariachi Para Todos.
-- Apply with the Supabase CLI (`supabase db push`) or the Dashboard SQL Editor.
-- This migration is additive. It does not alter auth.users or remove application data.

create schema if not exists private;

create type public.app_role as enum ('customer', 'admin', 'mariachi_team');
create type public.booking_status as enum (
  'pending',
  'accepted',
  'rejected',
  'cancelled',
  'completed'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_full_name_length check (char_length(full_name) <= 160),
  constraint profiles_phone_length check (phone is null or char_length(phone) between 7 and 32)
);

create table public.mariachi_groups (
  id uuid primary key default gen_random_uuid(),
  commercial_name text not null,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mariachi_groups_name_length check (char_length(commercial_name) between 1 and 160),
  constraint mariachi_groups_description_length check (char_length(description) <= 4000)
);

-- Membership is private operational data. It also lets a team member read only the
-- requests assigned to their own mariachi group.
create table public.mariachi_group_members (
  group_id uuid not null references public.mariachi_groups(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (group_id, profile_id)
);

create table public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete restrict,
  mariachi_group_id uuid references public.mariachi_groups(id) on delete set null,
  event_starts_at timestamptz not null,
  location text not null,
  event_type text not null,
  requested_musicians smallint not null,
  additional_details text,
  status public.booking_status not null default 'pending',
  -- A non-secret correlation identifier reserved for a future WhatsApp integration.
  -- It intentionally does not contain message contents, tokens, or credentials.
  whatsapp_reference text unique,
  whatsapp_conversation_started_at timestamptz,
  admin_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint booking_requests_event_future_at_insert check (event_starts_at > created_at),
  constraint booking_requests_location_length check (char_length(location) between 1 and 1000),
  constraint booking_requests_event_type_length check (char_length(event_type) between 1 and 120),
  constraint booking_requests_requested_musicians check (requested_musicians between 1 and 30),
  constraint booking_requests_details_length check (additional_details is null or char_length(additional_details) <= 4000),
  constraint booking_requests_whatsapp_reference_length check (whatsapp_reference is null or char_length(whatsapp_reference) <= 160)
);

create table public.booking_status_history (
  id bigint generated always as identity primary key,
  booking_request_id uuid not null references public.booking_requests(id) on delete cascade,
  previous_status public.booking_status,
  new_status public.booking_status not null,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  changed_at timestamptz not null default now(),
  constraint booking_status_history_noop check (
    previous_status is null or previous_status <> new_status
  )
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid not null unique references public.booking_requests(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete restrict,
  score smallint not null,
  comment text,
  created_at timestamptz not null default now(),
  constraint ratings_score_range check (score between 1 and 5),
  constraint ratings_comment_length check (comment is null or char_length(comment) <= 2000)
);

create index booking_requests_customer_created_idx
  on public.booking_requests (customer_id, created_at desc);
create index booking_requests_group_status_event_idx
  on public.booking_requests (mariachi_group_id, status, event_starts_at);
create index booking_status_history_booking_changed_idx
  on public.booking_status_history (booking_request_id, changed_at desc);
create index mariachi_group_members_profile_idx
  on public.mariachi_group_members (profile_id, group_id);
create index ratings_customer_created_idx on public.ratings (customer_id, created_at desc);

-- Privileged helpers are deliberately not exposed as client RPC endpoints. They are
-- used by RLS only and pin an empty search_path to avoid search path injection.
create or replace function private.is_mariachi_group_member(target_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.mariachi_group_members member
    where member.group_id = target_group_id
      and member.profile_id = (select auth.uid())
  );
$$;

create or replace function private.is_booking_group_member(target_booking_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.booking_requests request
    join public.mariachi_group_members member on member.group_id = request.mariachi_group_id
    where request.id = target_booking_id
      and member.profile_id = (select auth.uid())
  );
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- A user may edit their name/phone, but never elevate their own role. Administrative
-- role assignment is performed only by a trusted server using the service role.
create or replace function public.prevent_client_role_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and old.role is distinct from new.role then
    raise exception 'Users cannot change their own role';
  end if;
  return new;
end;
$$;

-- State changes are validated even when a future trusted server uses service_role.
-- The initial model deliberately has no direct rejected/cancelled/completed reversals.
create or replace function public.validate_booking_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = old.status then
    return new;
  end if;

  if (old.status = 'pending' and new.status in ('accepted', 'rejected', 'cancelled'))
     or (old.status = 'accepted' and new.status in ('completed', 'cancelled')) then
    return new;
  end if;

  raise exception 'Invalid booking status transition from % to %', old.status, new.status;
end;
$$;

create or replace function public.record_booking_status_history()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.booking_status_history (
      booking_request_id, previous_status, new_status, actor_profile_id
    ) values (new.id, null, new.status, (select auth.uid()));
  elsif new.status is distinct from old.status then
    insert into public.booking_status_history (
      booking_request_id, previous_status, new_status, actor_profile_id
    ) values (new.id, old.status, new.status, (select auth.uid()));
  end if;
  return new;
end;
$$;

create or replace function public.validate_rating_for_completed_booking()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.booking_requests request
    where request.id = new.booking_request_id
      and request.customer_id = new.customer_id
      and request.status = 'completed'
  ) then
    raise exception 'Ratings require a completed booking owned by the customer';
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger profiles_prevent_client_role_change before update on public.profiles
  for each row execute procedure public.prevent_client_role_change();
create trigger mariachi_groups_set_updated_at before update on public.mariachi_groups
  for each row execute procedure public.set_updated_at();
create trigger booking_requests_validate_status before update on public.booking_requests
  for each row execute procedure public.validate_booking_status_transition();
create trigger booking_requests_set_updated_at before update on public.booking_requests
  for each row execute procedure public.set_updated_at();
create trigger booking_requests_record_status after insert or update on public.booking_requests
  for each row execute procedure public.record_booking_status_history();
create trigger ratings_validate_completed_booking before insert on public.ratings
  for each row execute procedure public.validate_rating_for_completed_booking();

alter table public.profiles enable row level security;
alter table public.mariachi_groups enable row level security;
alter table public.mariachi_group_members enable row level security;
alter table public.booking_requests enable row level security;
alter table public.booking_status_history enable row level security;
alter table public.ratings enable row level security;

-- Explicit grants complement RLS. There are intentionally no client UPDATE grants
-- for bookings or ratings, and no client INSERT/UPDATE/DELETE grants for groups.
revoke all on table public.profiles, public.mariachi_groups, public.mariachi_group_members,
  public.booking_requests, public.booking_status_history, public.ratings from anon, authenticated;
grant select on public.mariachi_groups to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select on public.mariachi_group_members to authenticated;
grant select on public.booking_requests to authenticated;
grant insert (
  customer_id, mariachi_group_id, event_starts_at, location, event_type,
  requested_musicians, additional_details
) on public.booking_requests to authenticated;
grant select on public.booking_status_history to authenticated;
grant select, insert on public.ratings to authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_mariachi_group_member(uuid) to authenticated;
grant execute on function private.is_booking_group_member(uuid) to authenticated;
revoke all on function public.handle_new_auth_user() from public;
revoke all on function public.set_updated_at() from public;
revoke all on function public.prevent_client_role_change() from public;
revoke all on function public.validate_booking_status_transition() from public;
revoke all on function public.record_booking_status_history() from public;
revoke all on function public.validate_rating_for_completed_booking() from public;

create policy "profiles: users read their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "profiles: users update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "mariachi groups: active groups are publicly readable"
on public.mariachi_groups for select to anon, authenticated
using (is_active = true);

create policy "mariachi group memberships: members read their own memberships"
on public.mariachi_group_members for select to authenticated
using ((select auth.uid()) = profile_id);

create policy "booking requests: customers read their own requests"
on public.booking_requests for select to authenticated
using ((select auth.uid()) = customer_id);
create policy "booking requests: team members read their group requests"
on public.booking_requests for select to authenticated
using (private.is_mariachi_group_member(mariachi_group_id));
create policy "booking requests: customers create pending requests"
on public.booking_requests for insert to authenticated
with check (
  (select auth.uid()) = customer_id
  and status = 'pending'
  and event_starts_at > now()
);

create policy "booking history: customers read their own history"
on public.booking_status_history for select to authenticated
using (
  exists (
    select 1 from public.booking_requests request
    where request.id = booking_request_id
      and request.customer_id = (select auth.uid())
  )
);
create policy "booking history: team members read their group history"
on public.booking_status_history for select to authenticated
using (private.is_booking_group_member(booking_request_id));

create policy "ratings: customers read their own ratings"
on public.ratings for select to authenticated
using ((select auth.uid()) = customer_id);
create policy "ratings: team members read ratings for their group bookings"
on public.ratings for select to authenticated
using (private.is_booking_group_member(booking_request_id));
create policy "ratings: customers rate their completed bookings once"
on public.ratings for insert to authenticated
with check ((select auth.uid()) = customer_id);
