import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";
import { getSession } from "@/utils/session";

export default async function LoginPage() {
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

  return <LoginForm />;
}
