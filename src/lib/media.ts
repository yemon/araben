/**
 * Uploaded media on disk.
 *
 * Scenario videos live in uploads/scenario-videos/ at the project root and
 * are served by /media/scenario-videos/<file> (with range requests, so the
 * player can seek). Not public/: Next.js reads that folder once at start-up,
 * so a file uploaded later wouldn't be served until a restart.
 *
 * File names are generated here — never taken from the upload — so they
 * can't point anywhere else on disk.
 */
import 'server-only';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { VIDEO_TYPES, type VideoType } from './mediaLimits';

export { MAX_VIDEO_BYTES, VIDEO_TYPES, isVideoType, type VideoType } from './mediaLimits';

export const VIDEO_DIR = path.join(process.cwd(), 'uploads', 'scenario-videos');
export const VIDEO_URL_BASE = '/media/scenario-videos';

const MIME_BY_EXT: Record<string, VideoType> = { mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg' };

// Each type is checked against the file's first bytes, not just the type
// the browser claims. mp4: "ftyp" box at byte 4 · webm: EBML magic · ogg:
// "OggS".
export function looksLike(type: VideoType, head: Buffer): boolean {
  if (type === 'video/mp4') return head.length >= 8 && head.subarray(4, 8).toString('latin1') === 'ftyp';
  if (type === 'video/webm') return head.length >= 4 && head.readUInt32BE(0) === 0x1a45dfa3;
  return head.length >= 4 && head.subarray(0, 4).toString('latin1') === 'OggS';
}

export function newVideoFileName(scenarioId: number, type: VideoType): string {
  return `scenario-${scenarioId}-${crypto.randomBytes(8).toString('hex')}.${VIDEO_TYPES[type].ext}`;
}

// Only names this module generates are ever resolved to a path.
const FILE_NAME = /^scenario-\d+-[0-9a-f]{16}\.(mp4|webm|ogv)$/;

export function videoPath(fileName: string): string | null {
  return FILE_NAME.test(fileName) ? path.join(VIDEO_DIR, fileName) : null;
}

export function videoMimeType(fileName: string): VideoType | null {
  const ext = fileName.split('.').pop() ?? '';
  return MIME_BY_EXT[ext] ?? null;
}

export const videoUrl = (fileName: string) => `${VIDEO_URL_BASE}/${fileName}`;

/** Remove video files; a file that is already gone is fine. */
export async function deleteVideoFiles(fileNames: string[]) {
  await Promise.all(
    fileNames.map(async (name) => {
      const p = videoPath(name);
      if (!p) return;
      await fs.promises.rm(p, { force: true }).catch((e) => console.error(`Couldn't delete ${name}:`, e));
    }),
  );
}
