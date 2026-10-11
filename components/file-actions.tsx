"use client";

import { useState, useTransition } from "react";
import { deleteFile } from "@/app/files/actions";

const btn =
  "inline-flex h-9 items-center rounded-lg border border-line-strong px-3 text-[13px] text-neutral-300 transition hover:border-muted hover:text-white disabled:opacity-50";

export function FileActions({ id, url }: { id: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  function remove() {
    if (!confirm("Delete this file permanently? Its link will stop working."))
      return;
    start(async () => {
      try {
        await deleteFile(id);
      } catch (e) {
        alert(e instanceof Error ? e.message : "Delete failed");
      }
    });
  }

  return (
    <div className="flex gap-1.5">
      <button type="button" onClick={copy} className={btn}>
        {copied ? "copied" : "copy"}
      </button>
      <a href={url} target="_blank" rel="noreferrer" className={btn}>
        open ↗
      </a>
      <button
        type="button"
        aria-label="Delete"
        disabled={pending}
        onClick={remove}
        className={`${btn} w-9 justify-center`}
      >
        {pending ? "…" : "×"}
      </button>
    </div>
  );
}
