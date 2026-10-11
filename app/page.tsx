import { redirect } from "next/navigation";
import { UploadSection } from "@/components/upload-section";
import { Suspense } from "react";
import { getSession } from "@/utils/session";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<p>Loading…</p>}>
        <SessionContent />
      </Suspense>
    </main>
  );
}

async function SessionContent() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <p>Signed in as {session.user.name}</p>
      <UploadSection />
    </>
  );
}
