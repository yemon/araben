import { NextResponse } from 'next/server';
import { publishContentChange } from '@/lib/admin/audit';
import { deleteVideo, renameVideo } from '@/lib/admin/scenarioVideos';
import { requireAdminApi } from '@/lib/admin/session';
import { Check, badRequest, isId, notFound, readJson } from '@/lib/admin/validate';

/** One scenario video: PATCH { title } to rename it, DELETE to remove it. */

type Ctx = { params: Promise<{ videoId: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;
  const { videoId } = await params;
  if (!isId(videoId)) return notFound('Video not found');
  const check = new Check();
  const title = check.text((await readJson(request)).title, 'Title');
  if (check.error) return badRequest(check.error);
  if (!(await renameVideo(admin, Number(videoId), title))) return notFound('Video not found');
  publishContentChange();
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;
  const { videoId } = await params;
  if (!isId(videoId)) return notFound('Video not found');
  if (!(await deleteVideo(admin, Number(videoId)))) return notFound('Video not found');
  publishContentChange();
  return NextResponse.json({ success: true });
}
