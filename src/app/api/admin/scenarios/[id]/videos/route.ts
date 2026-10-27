import { NextResponse } from 'next/server';
import { publishContentChange } from '@/lib/admin/audit';
import { listScenarioVideos, reorderVideos } from '@/lib/admin/scenarioVideos';
import { requireAdminApi } from '@/lib/admin/session';
import { badRequest, isId, notFound, readJson } from '@/lib/admin/validate';

/**
 * A scenario's videos: GET the list, PUT { ids } to reorder them. Uploads go
 * to /api/uploads/scenario-videos/<id> (see there for why).
 */

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;
  const { id } = await params;
  if (!isId(id)) return notFound('Scenario not found');
  return NextResponse.json({ success: true, data: await listScenarioVideos(Number(id)) });
}

export async function PUT(request: Request, { params }: Ctx) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;
  const { id } = await params;
  if (!isId(id)) return notFound('Scenario not found');
  const { ids } = await readJson(request);
  if (!Array.isArray(ids) || !ids.every((v) => Number.isInteger(v))) return badRequest('Send the video ids in their new order');
  if (!(await reorderVideos(admin, Number(id), ids as number[]))) {
    return badRequest("That isn't this scenario's list of videos — reload the page and try again");
  }
  publishContentChange();
  return NextResponse.json({ success: true });
}
