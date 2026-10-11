"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/utils/auth-client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/login");
              router.refresh();
            },
          },
        })
      }
      className="h-9 rounded-lg border border-line-strong px-3.5 text-[13px] text-neutral-300 transition hover:border-muted hover:text-white"
    >
      Sign out
    </button>
  );
}
