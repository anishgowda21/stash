"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/utils/auth-client";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const { error } = await authClient.signIn.email({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });

    setLoading(false);
    if (error) return setError(error.message ?? "Something went wrong");
    router.push("/");
    router.refresh(); // makes server components re-read the new session
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <Link href="/sign-up">Sign up</Link>
    </div>
  );
}
