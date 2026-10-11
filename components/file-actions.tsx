"use client";

import { useState } from "react";

const btn =
  "inline-flex h-9 items-center rounded-lg border border-line-strong px-3 text-[13px] text-neutral-300 transition hover:border-muted hover:text-white";

export function FileActions({
  url,
  onDelete,
}: {
  url: string;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
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
        onClick={onDelete}
        className={`${btn} w-9 justify-center`}
      >
        ×
      </button>
    </div>
  );
}
