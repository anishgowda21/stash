"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/utils/auth-client";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const { error } = await authClient.signUp.email({
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
    });

    setLoading(false);
    if (error) return setError(error.message ?? "Something went wrong");
    router.push("/");
    router.refresh(); // makes server components re-read the new session
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input name="name" type="text" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {error && <p className="text-red-500">{error}</p>}
      <button disabled={loading}>
        {loading ? "Signing up..." : "Sign up"}
      </button>
    </form>
  );
}
