export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** The single email allowed to sign in and write. Everyone else is read-only. */
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "").toLowerCase();

/**
 * Whether Supabase is wired up. When false, the site still renders (empty
 * state + a setup notice) so you can develop the UI before creating a project.
 */
export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
