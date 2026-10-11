import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignUpForm } from "@/components/signup-form";
import { getSession } from "@/utils/session";

export default async function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<p>Loading…</p>}>
        <SessionContent />
      </Suspense>
    </main>
  );
}

async function SessionContent() {
  const session = await getSession();
  if (session) redirect("/");

  return <SignUpForm />;
}
