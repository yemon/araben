/**
 * Scenario videos in the admin: upload, list, rename, reorder, delete.
 *
 * An upload streams straight to disk — a video never sits in memory — into a
 * .part file that only becomes the real file once it has passed the size and
 * format checks and its row is written. Videos are logged as section
 * "videos": the content seed doesn't touch them, so they never block it.
 */
import 'server-only';
import fs from 'node:fs';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import type { ReadableStream as WebReadableStream } from 'node:stream/web';
import { prisma } from '@/lib/prisma';
import {
  MAX_VIDEO_BYTES,
  VIDEO_DIR,
  VIDEO_TYPES,
  deleteVideoFiles,
  looksLike,
  newVideoFileName,
  videoPath,
  videoUrl,
  type VideoType,
} from '@/lib/media';
import { logEdit } from './audit';
import type { AdminSession } from './session';

export interface AdminVideo {
  id: number;
  title: string;
  url: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

const toAdminVideo = (v: {
  id: number;
  title: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: bigint;
  createdAt: Date;
}): AdminVideo => ({
  id: v.id,
  title: v.title,
  url: videoUrl(v.fileName),
  originalName: v.originalName,
  mimeType: v.mimeType,
  sizeBytes: Number(v.sizeBytes),
  createdAt: v.createdAt.toISOString(),
});

export async function listScenarioVideos(scenarioId: number): Promise<AdminVideo[]> {
  const rows = await prisma.scenarioVideo.findMany({ where: { scenarioId }, orderBy: { position: 'asc' } });
  return rows.map(toAdminVideo);
}

export class UploadError extends Error {
  constructor(message: string, public status: 400 | 404 | 413 | 415) {
    super(message);
  }
}

/** Stream an uploaded video to disk and record it. */
export async function saveUploadedVideo(
  admin: AdminSession,
  scenarioId: number,
  upload: { body: ReadableStream<Uint8Array>; type: VideoType; originalName: string; title: string },
): Promise<AdminVideo> {
  const scenario = await prisma.scenario.findUnique({ where: { id: scenarioId }, select: { id: true, number: true } });
  if (!scenario) throw new UploadError('Scenario not found', 404);

  await fs.promises.mkdir(VIDEO_DIR, { recursive: true });
  const fileName = newVideoFileName(scenarioId, upload.type);
  const finalPath = videoPath(fileName)!;
  const partPath = `${finalPath}.part`;

  let size = 0;
  let head = Buffer.alloc(0);
  const meter = new Transform({
    transform(chunk: Buffer, _enc, done) {
      size += chunk.length;
      if (size > MAX_VIDEO_BYTES) {
        done(new UploadError(`Videos can be ${MAX_VIDEO_BYTES / 1024 / 1024} MB at most`, 413));
        return;
      }
      if (head.length < 16) head = Buffer.concat([head, chunk.subarray(0, 16 - head.length)]);
      done(null, chunk);
    },
  });

  try {
    await pipeline(Readable.fromWeb(upload.body as WebReadableStream<Uint8Array>), meter, fs.createWriteStream(partPath));
    if (size === 0) throw new UploadError('The file is empty', 400);
    if (!looksLike(upload.type, head)) {
      throw new UploadError(`That file isn't a valid ${VIDEO_TYPES[upload.type].label} video`, 415);
    }
    await fs.promises.rename(partPath, finalPath);
  } catch (e) {
    await fs.promises.rm(partPath, { force: true });
    throw e;
  }

  try {
    const row = await prisma.$transaction(async (tx) => {
      const last = await tx.scenarioVideo.aggregate({ where: { scenarioId }, _max: { position: true } });
      const video = await tx.scenarioVideo.create({
        data: {
          scenarioId,
          position: (last._max.position ?? -1) + 1,
          title: upload.title,
          fileName,
          originalName: upload.originalName,
          mimeType: upload.type,
          sizeBytes: BigInt(size),
        },
      });
      await logEdit(tx, admin, 'videos', 'create', fileName, `Added a video to scenario ${scenario.number}: ${upload.title || upload.originalName}`);
      return video;
    });
    return toAdminVideo(row);
  } catch (e) {
    await deleteVideoFiles([fileName]);
    throw e;
  }
}

export async function renameVideo(admin: AdminSession, id: number, title: string): Promise<boolean> {
  const video = await prisma.scenarioVideo.findUnique({ where: { id }, include: { scenario: { select: { number: true } } } });
  if (!video) return false;
  await prisma.$transaction(async (tx) => {
    await tx.scenarioVideo.update({ where: { id }, data: { title } });
    await logEdit(tx, admin, 'videos', 'update', video.fileName, `Renamed a video in scenario ${video.scenario.number}: ${title || video.originalName}`);
  });
  return true;
}

/** Put a scenario's videos in the given order; ids must be exactly its videos. */
export async function reorderVideos(admin: AdminSession, scenarioId: number, ids: number[]): Promise<boolean> {
  const videos = await prisma.scenarioVideo.findMany({ where: { scenarioId }, select: { id: true } });
  const known = new Set(videos.map((v) => v.id));
  if (ids.length !== known.size || new Set(ids).size !== ids.length || !ids.every((id) => known.has(id))) return false;
  const scenario = await prisma.scenario.findUnique({ where: { id: scenarioId }, select: { number: true } });
  await prisma.$transaction(async (tx) => {
    for (const [position, id] of ids.entries()) await tx.scenarioVideo.update({ where: { id }, data: { position } });
    await logEdit(tx, admin, 'videos', 'update', String(scenarioId), `Reordered the videos of scenario ${scenario?.number}`);
  });
  return true;
}

export async function deleteVideo(admin: AdminSession, id: number): Promise<boolean> {
  const video = await prisma.scenarioVideo.findUnique({ where: { id }, include: { scenario: { select: { number: true } } } });
  if (!video) return false;
  await prisma.$transaction(async (tx) => {
    await tx.scenarioVideo.delete({ where: { id } });
    await logEdit(tx, admin, 'videos', 'delete', video.fileName, `Removed a video from scenario ${video.scenario.number}: ${video.title || video.originalName}`);
  });
  // The row is gone first, so a failed file delete only leaves a stray file.
  await deleteVideoFiles([video.fileName]);
  return true;
}
