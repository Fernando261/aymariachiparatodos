import { supabase } from "@/lib/supabase";

export type AppRole =
  | "customer"
  | "admin"
  | "mariachi_team";

export async function getCurrentAppRole(): Promise<AppRole | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error("No fue posible validar la sesión.");
  }

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
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