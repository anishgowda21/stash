import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { db } from "@/utils/database";
import { filesTable } from "@/db/file-schema";
import { getSession } from "@/utils/session";
import { formatSize } from "@/utils/format";
import { FileTable } from "@/components/file-table";

export default function FilesPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <Suspense fallback={<p className="text-muted">Loading…</p>}>
        <FilesContent />
      </Suspense>
    </main>
  );
}

const cols =
  "grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_80px_110px_auto] items-center gap-4 px-5";

async function FilesContent() {
  const session = await getSession();
  if (!session) redirect("/login");

  const rows = await db
    .select()
    .from(filesTable)
    .where(eq(filesTable.userId, session.user.id))
    .orderBy(desc(filesTable.createdAt));

  const total = rows.reduce((sum, r) => sum + r.size, 0);
  const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" });
  const data = rows.map((r) => ({
    id: r.id,
    name: r.name,
    url: r.url,
    sizeLabel: formatSize(r.size),
    dateLabel: date.format(r.createdAt),
  }));

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Files</h1>
          <p className="mt-1.5 text-sm text-muted">
            {rows.length} {rows.length === 1 ? "file" : "files"} ·{" "}
            {formatSize(total)} used
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-lg bg-accent px-5 font-semibold text-bg transition hover:brightness-110"
        >
          + Upload
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface p-8 text-center text-muted">
          Nothing here yet.{" "}
          <Link
            href="/"
            className="text-white underline underline-offset-4"
          >
            Upload your first file
          </Link>
        </p>
      ) : (
        <FileTable rows={data} />
      )}
    </>
  );
}
