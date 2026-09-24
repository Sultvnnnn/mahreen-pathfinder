import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://fqalszhxakqhihynwuir.supabase.co";
// Fallback key used when NEXT_PUBLIC_SUPABASE_ANON_KEY is not yet provided in .env.local
// This prevents @supabase/ssr from throwing an unhandled runtime error at client initialization.
const FALLBACK_ANON_KEY = "placeholder-anon-key-configure-env-local";

export function isSupabaseConfigured(): boolean {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(anonKey && anonKey.trim() !== "" && anonKey !== FALLBACK_ANON_KEY);
}

let clientInstance: SupabaseClient | null = null;

/**
 * Returns the singleton Supabase browser client.
 */
export function getSupabase(): SupabaseClient {
  if (!clientInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || DEFAULT_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || FALLBACK_ANON_KEY;
    clientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return clientInstance;
}
