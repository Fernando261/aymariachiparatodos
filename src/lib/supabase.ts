import "react-native-url-polyfill/auto";
import "expo-sqlite/localStorage/install";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * True only when the public Expo configuration required to create the client is set.
 * This does not test network access or validate the credentials with Supabase.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  throw new Error(
    "Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and " +
      "EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or the legacy EXPO_PUBLIC_SUPABASE_ANON_KEY).",
  );
}

/**
 * Client-side Supabase client. Only a publishable/anon key may be used here; RLS
 * remains the authorization boundary for requests made from the mobile application.
 */
export const supabase = createClient(supabaseUrl!, supabaseKey!, {
  auth: {
    storage: localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
