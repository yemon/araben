import { NextResponse } from 'next/server';
import { publishContentChange } from '@/lib/admin/audit';
import {
  getHiddenList,
  isHiddenListKey,
  readHiddenListInput,
  saveHiddenList,
} from '@/lib/admin/hidden';
import { requireAdminApi } from '@/lib/admin/session';
import { badRequest, notFound, readJson } from '@/lib/admin/validate';

/**
 * One of the hidden-word side lists (persian | mixed | english): GET its
 * rows, PUT the whole list back in order.
 */

type Ctx = { params: Promise<{ list: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;
  const { list } = await params;
  if (!isHiddenListKey(list)) return notFound('List not found');
  return NextResponse.json({ success: true, data: await getHiddenList(list) });
}

export async function PUT(request: Request, { params }: Ctx) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;
  const { list } = await params;
  if (!isHiddenListKey(list)) return notFound('List not found');
  const input = readHiddenListInput(list, await readJson(request));
  if ('error' in input) return badRequest(input.error);
  try {
    await saveHiddenList(admin, list, input.data);
    publishContentChange();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PUT /api/admin/hidden/lists/${list} failed:`, error);
    return NextResponse.json({ success: false, error: 'Failed to save the list' }, { status: 500 });
  }
}
