"use client";

import { useRef, useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";

type Uploaded = { key: string; name: string; size: number; url: string };

const ghost =
  "inline-flex h-11 items-center rounded-lg border border-line-strong px-4 text-sm text-neutral-200 transition hover:border-muted hover:text-white";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let n = bytes / 1024;
  let i = 0;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 100 ? 0 : 1)} ${units[i]}`;
}

export function UploadSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState<Uploaded[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("fileUploader", {
    onUploadProgress: setProgress,
    onClientUploadComplete: (res) => {
      setUploaded((prev) => [
        ...res.map((f) => ({
          key: f.key,
          name: f.name,
          size: f.size,
          url: f.ufsUrl,
        })),
        ...prev,
      ]);
      setProgress(0);
    },
    onUploadError: (e) => {
      setError(e.message);
      setProgress(0);
    },
  });

  function handleFiles(list: FileList | null) {
    if (!list?.length || isUploading) return;
    setError(null);
    startUpload(Array.from(list));
  }

  async function copy(url: string, key: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center gap-4 rounded-2xl border-[1.5px] border-dashed px-6 py-14 text-center transition ${
          dragging
            ? "border-accent bg-surface"
            : "border-line-strong bg-[#0f1114]"
        }`}
      >
        <p className="text-xl font-medium">
          {isUploading ? `Uploading… ${progress}%` : "Drop files here"}
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="h-11 rounded-lg bg-accent px-6 font-semibold text-bg transition hover:brightness-110 disabled:opacity-60"
        >
          Browse files
        </button>

        {isUploading && (
          <div className="h-1.5 w-full max-w-sm rounded-full bg-line">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <p className="font-mono text-xs text-muted">
          up to 10 files · 1 GB each
        </p>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {uploaded.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
            Just uploaded
          </h2>
          <ul className="divide-y divide-line rounded-xl border border-line bg-surface">
            {uploaded.map((f) => (
              <li key={f.key} className="flex flex-col gap-3 p-5">
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="truncate">{f.name}</span>
                  <span className="shrink-0 font-mono text-muted">
                    {formatSize(f.size)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex h-11 min-w-56 flex-1 items-center overflow-hidden rounded-lg border border-line-strong bg-bg px-3.5">
                    <span className="truncate font-mono text-[13px] text-accent">
                      {f.url}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(f.url, f.key)}
                    className={ghost}
                  >
                    {copied === f.key ? "copied" : "copy link"}
                  </button>
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noreferrer"
                    className={ghost}
                  >
                    open ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
