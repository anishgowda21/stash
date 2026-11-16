"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/utils/auth-client";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    return () => {
      form?.reset();
      setError(null);
      setLoading(false);
    };
  }, []);

  const label = "font-mono text-xs uppercase tracking-widest text-muted";
  const input =
    "h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-[15px] text-white outline-none focus:border-accent";

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const { error } = await authClient.signIn.email({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });

    if (error) {
      (formEl.elements.namedItem("password") as HTMLInputElement).value = "";
      setLoading(false);
      return setError(error.message ?? "Something went wrong");
    }

    router.push("/");
    router.refresh(); // makes server components re-read the new session
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-8">
      <div className="mb-6 flex items-center gap-2.5 font-mono font-medium">
        <span className="size-4.5 rounded-[5px] bg-accent" />
        stash
      </div>
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="mt-1.5 text-sm text-muted">
        Your private file drop. Welcome back.
      </p>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="mt-6 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={input}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className={label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={input}
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}
        <button
          disabled={loading}
          className="h-11 rounded-lg bg-accent font-semibold text-bg transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        No account?{" "}
        <Link
          href="/sign-up"
          className="text-white underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
