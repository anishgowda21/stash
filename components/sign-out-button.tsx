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
    >
      Sign out
    </button>
  );
}
