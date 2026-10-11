import Link from "next/link";
import { SignOutButton } from "./sign-out-button";
import { getSession } from "@/utils/session";

export async function Header() {
  const session = await getSession();
  if (!session) return null;

  return (
    <header className="flex h-16 items-center justify-between border-b border-line px-6">
      <Link
        href="/"
        className="flex items-center gap-2.5 font-mono font-medium"
      >
        <span className="size-4.5 rounded-[5px] bg-accent" />
        stash
      </Link>
      <div className="flex items-center gap-4">
        <span className="hidden font-mono text-[13px] text-muted sm:inline">
          {session.user.email}
        </span>
        <SignOutButton />
      </div>
    </header>
  );
}
