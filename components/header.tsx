import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { SignOutButton } from "./sign-out-button";
import { getSession } from "@/utils/session";

export async function Header() {
  const session = await getSession();
  if (!session) return null;

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <span className="font-semibold">Stash</span>
      <div className="flex items-center gap-4">
        <span className="text-sm">{session.user.email}</span>
        <SignOutButton />
      </div>
    </header>
  );
}
