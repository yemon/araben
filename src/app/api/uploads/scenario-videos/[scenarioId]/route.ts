import { NextResponse } from 'next/server';
import { publishContentChange } from '@/lib/admin/audit';
import { UploadError, saveUploadedVideo } from '@/lib/admin/scenarioVideos';
import { requireAdminApi } from '@/lib/admin/session';
import { Check, badRequest, isId } from '@/lib/admin/validate';
import { MAX_VIDEO_BYTES, VIDEO_TYPES, isVideoType } from '@/lib/media';

/**
 * Upload one scenario video. The body is the raw file (not a form), its
 * Content-Type the video type; X-File-Name and X-Video-Title carry the
 * original name and an optional title, URI-encoded.
 *
 * Deliberately outside /api/admin: the proxy buffers request bodies it sees
 * and cuts them off at 10 MB, which would truncate a video. So this route
 * does the proxy's checks itself — a signed-in admin, and a same-site
 * request — before streaming the body to disk.
 */

type Ctx = { params: Promise<{ scenarioId: string }> };

const decodeHeader = (v: string | null) => {
  try {
    return decodeURIComponent(v ?? '');
  } catch {
    return '';
  }
};

export async function POST(request: Request, { params }: Ctx) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ success: false, error: 'Cross-site request refused' }, { status: 403 });
  }
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const { scenarioId } = await params;
  if (!isId(scenarioId)) return NextResponse.json({ success: false, error: 'Scenario not found' }, { status: 404 });

  const type = (request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  if (!isVideoType(type)) {
    const allowed = Object.values(VIDEO_TYPES).map((t) => t.label).join(', ');
    return NextResponse.json({ success: false, error: `Upload an ${allowed} video` }, { status: 415 });
  }
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_VIDEO_BYTES) {
    return NextResponse.json(
      { success: false, error: `Videos can be ${MAX_VIDEO_BYTES / 1024 / 1024} MB at most` },
      { status: 413 },
    );
  }
  if (!request.body) return badRequest('No file was sent');

  const check = new Check();
  const originalName = check.text(decodeHeader(request.headers.get('x-file-name')) || 'video', 'File name');
  const title = check.text(decodeHeader(request.headers.get('x-video-title')), 'Title');
  if (check.error) return badRequest(check.error);

  try {
    const video = await saveUploadedVideo(admin, Number(scenarioId), { body: request.body, type, originalName, title });
    publishContentChange();
    return NextResponse.json({ success: true, data: video }, { status: 201 });
  } catch (e) {
    if (e instanceof UploadError) return NextResponse.json({ success: false, error: e.message }, { status: e.status });
    console.error('Video upload failed:', e);
    return NextResponse.json({ success: false, error: 'Failed to save the video' }, { status: 500 });
  }
}
