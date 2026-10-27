import fs from 'node:fs';
import { Readable } from 'node:stream';
import { videoMimeType, videoPath } from '@/lib/media';

/**
 * Serves uploaded scenario videos from uploads/scenario-videos/.
 *
 * Supports range requests — the <video> element asks for parts of the file
 * to start quickly and to seek. Every upload gets a new random name, so a
 * file never changes and can be cached for good.
 */

type Ctx = { params: Promise<{ file: string }> };

const notFound = () => new Response('Not found', { status: 404 });

async function serve(request: Request, { params }: Ctx, withBody: boolean) {
  const { file } = await params;
  const filePath = videoPath(file);
  const type = videoMimeType(file);
  if (!filePath || !type) return notFound();

  const stat = await fs.promises.stat(filePath).catch(() => null);
  if (!stat?.isFile()) return notFound();
  const size = stat.size;

  const headers = new Headers({
    'Content-Type': type,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Last-Modified': stat.mtime.toUTCString(),
  });

  let start = 0;
  let end = size - 1;
  let status = 200;
  const range = request.headers.get('range');
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!m || (!m[1] && !m[2])) {
      headers.set('Content-Range', `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }
    if (m[1]) {
      start = Number(m[1]);
      end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
    } else {
      // bytes=-N: the last N bytes.
      start = Math.max(0, size - Number(m[2]));
    }
    if (start > end || start >= size) {
      headers.set('Content-Range', `bytes */${size}`);
      return new Response(null, { status: 416, headers });
    }
    status = 206;
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  }
  headers.set('Content-Length', String(end - start + 1));

  if (!withBody) return new Response(null, { status, headers });
  const stream = Readable.toWeb(fs.createReadStream(filePath, { start, end })) as ReadableStream<Uint8Array>;
  return new Response(stream, { status, headers });
}

export function GET(request: Request, ctx: Ctx) {
  return serve(request, ctx, true);
}

export function HEAD(request: Request, ctx: Ctx) {
  return serve(request, ctx, false);
}
