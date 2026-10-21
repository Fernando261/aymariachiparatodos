import { supabase } from "@/lib/supabase";

export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled" | "completed";

export type BookingRequest = {
  id: string;
  customer_id: string;
  mariachi_group_id: string | null;
  event_starts_at: string;
  location: string;
  event_type: string;
  requested_musicians: number;
  additional_details: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
  completed: "Completada",
};

export function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export async function getMyBookings(customerId: string) {
  return supabase
    .from("booking_requests")
    .select("id, customer_id, mariachi_group_id, event_starts_at, location, event_type, requested_musicians, additional_details, status, created_at, updated_at")
    .eq("customer_id", customerId)
    .order("event_starts_at", { ascending: true });
}

export async function getBookingById(id: string) {
  return supabase
    .from("booking_requests")
    .select("id, customer_id, mariachi_group_id, event_starts_at, location, event_type, requested_musicians, additional_details, status, created_at, updated_at")
    .eq("id", id)
    .single();
}
