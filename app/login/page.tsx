"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { sendLoginLink, type LoginState } from "./actions";

const initialState: LoginState = { status: "idle", message: "" };

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(sendLoginLink, initialState);

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-1 text-sm text-foreground/70">
        Owner-only. A one-time sign-in link is emailed to the site owner.
      </p>

      <form action={formAction} className="mt-6 space-y-3">
        <input type="hidden" name="next" value={next} />
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-md border border-border bg-card px-3 py-2 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-accent px-3 py-2 font-semibold text-background disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send magic link"}
        </button>
      </form>

      {state.message && (
        <p className={`mt-4 text-sm ${state.status === "error" ? "text-red-500" : "text-accent"}`}>
          {state.message}
        </p>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
