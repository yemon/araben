/**
 * The admin audit log (content_edits): what changed, who changed it, when.
 * The dashboard shows the latest entries; the content seed reads it to avoid
 * overwriting edits made since it last ran.
 */
import 'server-only';
import { revalidatePath } from 'next/cache';
import type { Prisma } from '@prisma/client';
import { invalidateContentCache } from '@/lib/content';
import type { AdminSession } from './session';

export type EditSection = 'scenarios' | 'surahs' | 'hidden' | 'trace' | 'videos';
export type EditAction = 'create' | 'update' | 'delete';

export async function logEdit(
  tx: Prisma.TransactionClient,
  admin: AdminSession,
  section: EditSection,
  action: EditAction,
  ref: string,
  summary: string,
) {
  await tx.contentEdit.create({
    data: { section, action, ref, summary: summary.slice(0, 191), adminEmail: admin.email },
  });
}

/**
 * After a content change commits: drop the loader's cached snapshot and mark
 * every page stale, so the public site shows the change on its next request.
 * Pages share words across sections, so everything is revalidated.
 */
export function publishContentChange() {
  invalidateContentCache();
  revalidatePath('/', 'layout');
}
