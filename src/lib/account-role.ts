import { supabase } from "@/lib/supabase";

export type AppRole =
  | "customer"
  | "admin"
  | "mariachi_team";

// The ID comes from the centrally observed Supabase session, never from route
// parameters or signup metadata. Database RLS remains the authorization boundary.
export async function getAppRole(userId: string): Promise<AppRole> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    throw new Error("No fue posible consultar el rol del usuario.");
  }

  const role = profile.role;

  if (
    role === "customer" ||
    role === "admin" ||
    role === "mariachi_team"
  ) {
    return role;
  }

  throw new Error("Rol de usuario no reconocido.");
}
