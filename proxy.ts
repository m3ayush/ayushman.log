import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 "Proxy" (formerly Middleware): refreshes the Supabase session and
// guards the /admin area. Runs before routes render.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Only the private admin area needs the auth guard + session refresh. Public
  // pages skip the proxy entirely, so reading the blog stays fast.
  matcher: ["/admin/:path*"],
};
