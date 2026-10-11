"use client";

import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { deleteFile } from "@/app/files/actions";
import { FileActions } from "./file-actions";

export type FileRowData = {
  id: string;
  name: string;
  url: string;
  sizeLabel: string;
  dateLabel: string;
};

const cols =
  "grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_80px_110px_auto] items-center gap-4 px-5";

export function FileTable({ rows }: { rows: FileRowData[] }) {
  const [visible, hide] = useOptimistic(rows, (state, id: string) =>
    state.filter((r) => r.id !== id),
  );
  const [, startTransition] = useTransition();

  function remove(row: FileRowData) {
    if (!confirm(`Delete ${row.name} permanently? Its link will stop working.`))
      return;

    startTransition(async () => {
      hide(row.id); // row disappears immediately
      try {
        const res = await deleteFile(row.id);
        if (res.ok) toast.success(`Deleted ${row.name}`);
        else toast.error(res.error); // row reappears when the transition ends
      } catch {
        toast.error("Couldn't reach the server");
      }
    });
  }

  if (visible.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-surface p-8 text-center text-muted">
        Nothing here yet.{" "}
        <Link
          href="/"
          className="text-white underline underline-offset-4"
        >
          Upload your first file
        </Link>
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface">
      <div className="min-w-125">
        <div
          className={`${cols} py-3.5 font-mono text-xs uppercase tracking-widest text-muted`}
        >
          <span>Name</span>
          <span>Link</span>
          <span>Size</span>
          <span>Uploaded</span>
          <span />
        </div>
        {visible.map((r) => (
          <div
            key={r.id}
            className={`${cols} border-t border-line py-3 text-sm`}
          >
            <span className="truncate" title={r.name}>
              {r.name}
            </span>
            <span
              className="truncate font-mono text-[13px] text-muted"
              title={r.url}
            >
              {r.url}
            </span>
            <span className="font-mono text-[13px] text-muted">
              {r.sizeLabel}
            </span>
            <span className="text-[13px] text-muted">{r.dateLabel}</span>
            <FileActions url={r.url} onDelete={() => remove(r)} />
          </div>
        ))}
      </div>
    </div>
  );
}
