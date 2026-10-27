'use client';

/**
 * The videos of one scenario: upload (with progress, cancellable), rename,
 * reorder and remove. Each change is saved as it happens — videos aren't
 * part of the scenario form above.
 */

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/admin/icons';
import { ErrorBanner, inputClass } from '@/components/admin/ui';
import { MAX_VIDEO_BYTES, VIDEO_TYPES, isVideoType } from '@/lib/mediaLimits';

export interface ManagedVideo {
  id: number;
  title: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
}

const ACCEPT = Object.keys(VIDEO_TYPES).join(',');
const FORMATS = Object.values(VIDEO_TYPES)
  .map((t) => t.label)
  .join(', ');
const MAX_MB = MAX_VIDEO_BYTES / 1024 / 1024;

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 * 1024
    ? `${(bytes / 1024 ** 3).toFixed(1)} GB`
    : bytes >= 1024 * 1024
      ? `${(bytes / 1024 ** 2).toFixed(1)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`;

async function call(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await res.json().catch(() => ({}));
  if (!result.success) throw new Error(result.error || `Request failed (error ${res.status})`);
  return result;
}

export function ScenarioVideoManager({ scenarioId, initial }: { scenarioId: number; initial: ManagedVideo[] }) {
  const router = useRouter();
  const [videos, setVideos] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick(f: File | undefined | null) {
    setError(null);
    if (!f) return;
    if (!isVideoType(f.type)) {
      setError(`"${f.name}" isn't a video this site can play. Use ${FORMATS}.`);
      return;
    }
    if (f.size > MAX_VIDEO_BYTES) {
      setError(`"${f.name}" is ${formatSize(f.size)}; videos can be ${MAX_MB} MB at most.`);
      return;
    }
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '));
  }

  function upload() {
    if (!file) return;
    setError(null);
    setProgress(0);
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    // Trailing slash included: the site redirects without one, and a
    // redirect would mean sending the whole file twice.
    xhr.open('POST', `/api/uploads/scenario-videos/${scenarioId}/`);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.setRequestHeader('X-File-Name', encodeURIComponent(file.name));
    xhr.setRequestHeader('X-Video-Title', encodeURIComponent(title.trim()));
    xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(e.loaded / e.total);
    xhr.onload = () => {
      xhrRef.current = null;
      setProgress(null);
      let result: { success?: boolean; data?: ManagedVideo; error?: string } = {};
      try {
        result = JSON.parse(xhr.responseText);
      } catch {}
      if (result.success && result.data) {
        setVideos((v) => [...v, result.data!]);
        setFile(null);
        setTitle('');
        if (inputRef.current) inputRef.current.value = '';
        router.refresh();
      } else {
        setError(result.error || `Upload failed (error ${xhr.status})`);
      }
    };
    xhr.onerror = () => {
      xhrRef.current = null;
      setProgress(null);
      setError("The upload didn't get through — check your connection and try again");
    };
    xhr.onabort = () => {
      xhrRef.current = null;
      setProgress(null);
    };
    xhr.send(file);
  }

  async function rename(v: ManagedVideo, next: string) {
    if (next.trim() === v.title) return;
    setBusyId(v.id);
    setError(null);
    try {
      await call(`/api/admin/scenario-videos/${v.id}/`, 'PATCH', { title: next.trim() });
      setVideos((list) => list.map((x) => (x.id === v.id ? { ...x, title: next.trim() } : x)));
    } catch (e) {
      setError((e as Error).message);
    }
    setBusyId(null);
  }

  async function move(i: number, by: -1 | 1) {
    const next = videos.slice();
    [next[i], next[i + by]] = [next[i + by], next[i]];
    setBusyId(videos[i].id);
    setError(null);
    try {
      await call(`/api/admin/scenarios/${scenarioId}/videos/`, 'PUT', { ids: next.map((v) => v.id) });
      setVideos(next);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusyId(null);
  }

  async function remove(v: ManagedVideo) {
    if (!window.confirm(`Remove "${v.title || v.originalName}"? The file is deleted too.`)) return;
    setBusyId(v.id);
    setError(null);
    try {
      await call(`/api/admin/scenario-videos/${v.id}/`, 'DELETE');
      setVideos((list) => list.filter((x) => x.id !== v.id));
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    }
    setBusyId(null);
  }

  const uploading = progress !== null;
  const small =
    'inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-fg disabled:opacity-30 disabled:hover:bg-transparent';

  return (
    <section className="card mt-6 p-6" aria-labelledby="videos-heading">
      <div className="mb-1 flex items-baseline justify-between">
        <h2 id="videos-heading" className="text-lg font-bold text-fg">
          Videos
        </h2>
        <span className="text-xs font-bold text-muted tabular-nums">{videos.length} videos</span>
      </div>
      <p className="mb-4 text-sm text-muted">
        Shown above the dialogue, in this order. Each change here is saved straight away.
      </p>
      <ErrorBanner error={error} />

      {videos.length > 0 && (
        <ol className="mt-4 space-y-3">
          {videos.map((v, i) => (
            <li key={v.id} className="card-2 flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
              <video
                src={v.url}
                preload="metadata"
                muted
                controls
                className="aspect-video w-full shrink-0 rounded-lg bg-black sm:w-48"
              />
              <div className="min-w-0 flex-1">
                <label htmlFor={`video-title-${v.id}`} className="mb-0.5 block text-xs font-semibold text-muted">
                  Title (shown on the switch button)
                </label>
                <input
                  id={`video-title-${v.id}`}
                  defaultValue={v.title}
                  placeholder={`Video ${i + 1}`}
                  onBlur={(e) => rename(v, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                  className={`${inputClass} py-2 text-sm`}
                />
                <p className="mt-1 truncate text-xs text-muted">
                  {v.originalName} · {formatSize(v.sizeBytes)}
                </p>
              </div>
              <div className="flex items-center gap-0.5 self-end sm:self-center">
                <button type="button" className={small} onClick={() => move(i, -1)} disabled={i === 0 || busyId !== null} aria-label={`Move video ${i + 1} up`} title="Move up">
                  <Icon name="chevronUp" size={16} />
                </button>
                <button type="button" className={small} onClick={() => move(i, 1)} disabled={i === videos.length - 1 || busyId !== null} aria-label={`Move video ${i + 1} down`} title="Move down">
                  <Icon name="chevronDown" size={16} />
                </button>
                <button type="button" className={`${small} hover:!text-rose-600`} onClick={() => remove(v)} disabled={busyId !== null} aria-label={`Remove video ${i + 1}`} title="Remove">
                  <Icon name="trash" size={15} />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!uploading) pick(e.dataTransfer.files[0]);
        }}
        className={`mt-4 rounded-2xl border-2 border-dashed p-5 transition-colors ${
          dragging ? 'border-accent bg-accent-soft' : 'border-border'
        }`}
      >
        {!file ? (
          <div className="flex flex-col items-center gap-2 py-3 text-center">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Icon name="upload" size={20} strokeWidth={2} />
            </span>
            <p className="font-semibold text-fg">Drop a video here, or</p>
            <label className="btn btn-ghost cursor-pointer">
              Choose a file
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="sr-only"
                onChange={(e) => pick(e.target.files?.[0])}
              />
            </label>
            <p className="text-xs text-muted">
              {FORMATS} · up to {MAX_MB} MB
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon name="video" size={18} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-fg">{file.name}</p>
                <p className="text-xs text-muted">{formatSize(file.size)}</p>
              </div>
              {!uploading && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setTitle('');
                    if (inputRef.current) inputRef.current.value = '';
                  }}
                  className={small}
                  aria-label="Choose a different file"
                  title="Choose a different file"
                >
                  <Icon name="x" size={16} />
                </button>
              )}
            </div>
            <label className="block">
              <span className="text-xs font-semibold text-muted">Title (optional)</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                placeholder={`Video ${videos.length + 1}`}
                className={`mt-0.5 ${inputClass} py-2 text-sm`}
              />
            </label>
            {uploading ? (
              <div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-surface-2"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress! * 100)}
                  aria-label="Upload progress"
                >
                  <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${progress! * 100}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted">
                  <span className="tabular-nums">
                    {progress! < 1 ? `Uploading… ${Math.round(progress! * 100)}%` : 'Checking and saving…'}
                  </span>
                  {progress! < 1 && (
                    <button type="button" onClick={() => xhrRef.current?.abort()} className="font-semibold text-rose-600 hover:underline">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button type="button" onClick={upload} className="btn btn-primary">
                <Icon name="upload" size={16} strokeWidth={2.5} />
                Upload video
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
