"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL, isSupabaseConfigured } from "@/lib/supabase/config";

export type LoginState = { status: "idle" | "sent" | "error"; message: string };

/**
 * Send a magic-link ONLY to the owner. For any other address we do nothing
 * (no email, no account created) but return the same neutral message — so a
 * stranger can neither sign in nor discover who the owner is.
 */
export async function sendLoginLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = ((formData.get("email") as string) || "").trim().toLowerCase();
  const next = (formData.get("next") as string) || "/admin";

  if (!email) return { status: "error", message: "Please enter your email." };
  if (!isSupabaseConfigured) {
    return { status: "error", message: "Auth isn't configured yet (missing Supabase keys)." };
  }

  const neutral: LoginState = {
    status: "sent",
    message: "If that address is authorized, a sign-in link is on its way — check your inbox.",
  };

  // Owner gate: bail out silently for anyone who isn't the owner.
  if (email !== ADMIN_EMAIL) return neutral;

  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto = hdrs.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${proto}://${host}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { status: "error", message: error.message };
  return neutral;
}
