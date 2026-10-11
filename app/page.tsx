import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { UploadSection } from "@/components/upload-section";
import { getSession } from "@/utils/session";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
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
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Upload</h1>
          <p className="mt-1.5 text-sm text-muted">
            Signed in as {session.user.name}. Drop a file, get a link.
          </p>
        </div>
        <Link
          href="/files"
          className="font-mono text-sm text-muted underline underline-offset-4 hover:text-white"
        >
          view all files →
        </Link>
      </div>
      <UploadSection />
    </>
  );
}
