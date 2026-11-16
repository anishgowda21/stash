"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/utils/auth-client";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onSignOut() {
    setPending(true);
    const { error } = await authClient.signOut();

    if (error) {
      setPending(false);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={onSignOut}
      disabled={pending}
      className="h-9 rounded-lg border border-line-strong px-3.5 text-[13px] text-neutral-300 transition hover:border-muted hover:text-white disabled:opacity-60"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
