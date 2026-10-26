/**
 * Route handlers shared by the content sections of the admin API:
 *
 *   /api/admin/<section>        GET list · POST create
 *   /api/admin/<section>/<id>   GET one  · PUT update · DELETE
 *
 * Every handler checks the admin session itself (the proxy is only a first
 * filter), and a successful write refreshes the public pages.
 */
import 'server-only';
import { NextResponse } from 'next/server';
import { publishContentChange } from './audit';
import { requireAdminApi, type AdminSession } from './session';
import { badRequest, isId, notFound, readJson } from './validate';
import type { SaveResult } from './scenarios';

export interface SectionCrud<Input> {
  label: string; // "Scenario" — for messages
  list: () => Promise<unknown>;
  get: (id: number) => Promise<unknown | null>;
  read: (body: Record<string, unknown>) => { data: Input } | { error: string };
  save: (admin: AdminSession, id: number | null, data: Input) => Promise<SaveResult>;
  remove: (admin: AdminSession, id: number) => Promise<boolean>;
}

type Ctx = { params: Promise<{ id: string }> };

const failed = (label: string, what: string, error: unknown) => {
  console.error(`Admin ${label} ${what} failed:`, error);
  return NextResponse.json({ success: false, error: `Failed to ${what} the ${label.toLowerCase()}` }, { status: 500 });
};

function saved(result: SaveResult, status = 200) {
  if ('error' in result) return NextResponse.json({ success: false, error: result.error }, { status: result.status });
  publishContentChange();
  return NextResponse.json({ success: true, data: { id: result.id } }, { status });
}

export function collectionHandlers<Input>(crud: SectionCrud<Input>) {
  return {
    async GET() {
      const admin = await requireAdminApi();
      if (admin instanceof NextResponse) return admin;
      try {
        return NextResponse.json({ success: true, data: await crud.list() });
      } catch (e) {
        return failed(crud.label, 'list', e);
      }
    },
    async POST(request: Request) {
      const admin = await requireAdminApi();
      if (admin instanceof NextResponse) return admin;
      const input = crud.read(await readJson(request));
      if ('error' in input) return badRequest(input.error);
      try {
        return saved(await crud.save(admin, null, input.data), 201);
      } catch (e) {
        return failed(crud.label, 'create', e);
      }
    },
  };
}

export function itemHandlers<Input>(crud: SectionCrud<Input>) {
  return {
    async GET(_request: Request, { params }: Ctx) {
      const admin = await requireAdminApi();
      if (admin instanceof NextResponse) return admin;
      const { id } = await params;
      if (!isId(id)) return notFound(`${crud.label} not found`);
      try {
        const row = await crud.get(Number(id));
        return row ? NextResponse.json({ success: true, data: row }) : notFound(`${crud.label} not found`);
      } catch (e) {
        return failed(crud.label, 'load', e);
      }
    },
    async PUT(request: Request, { params }: Ctx) {
      const admin = await requireAdminApi();
      if (admin instanceof NextResponse) return admin;
      const { id } = await params;
      if (!isId(id)) return notFound(`${crud.label} not found`);
      const input = crud.read(await readJson(request));
      if ('error' in input) return badRequest(input.error);
      try {
        return saved(await crud.save(admin, Number(id), input.data));
      } catch (e) {
        return failed(crud.label, 'save', e);
      }
    },
    async DELETE(_request: Request, { params }: Ctx) {
      const admin = await requireAdminApi();
      if (admin instanceof NextResponse) return admin;
      const { id } = await params;
      if (!isId(id)) return notFound(`${crud.label} not found`);
      try {
        if (!(await crud.remove(admin, Number(id)))) return notFound(`${crud.label} not found`);
        publishContentChange();
        return NextResponse.json({ success: true });
      } catch (e) {
        return failed(crud.label, 'delete', e);
      }
    },
  };
}
