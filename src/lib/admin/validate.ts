/**
 * Reads and checks fields from an admin request body.
 *
 *   const check = new Check();
 *   const title = check.text(body.title, 'Title', { required: true });
 *   if (check.error) return badRequest(check.error);
 *
 * Only fields read through a Check reach the database, so whatever else a
 * form posts back is ignored. The first problem found is kept for the
 * reply; later reads still return safe values so the code can carry on.
 */
import { NextResponse } from 'next/server';

// Prisma's MySQL String is VARCHAR(191) characters; @db.Text holds 65,535
// bytes.
const VARCHAR_CHARS = 191;
const TEXT_BYTES = 65_535;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class Check {
  error: string | null = null;

  fail(message: string) {
    this.error ??= message;
  }

  /** A short string (VARCHAR). Trimmed; empty is allowed unless required. */
  text(value: unknown, label: string, { required = false } = {}): string {
    const s = typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();
    if (required && !s) this.fail(`${label} is required`);
    else if ([...s].length > VARCHAR_CHARS) this.fail(`${label} is too long (${VARCHAR_CHARS} characters at most)`);
    return s;
  }

  /** A long string (TEXT). Trimmed; empty is allowed unless required. */
  longText(value: unknown, label: string, { required = false } = {}): string {
    const s = typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();
    if (required && !s) this.fail(`${label} is required`);
    else if (Buffer.byteLength(s) > TEXT_BYTES) this.fail(`${label} is too long`);
    return s;
  }

  /** A URL slug: lowercase letters, digits and single hyphens. */
  slug(value: unknown, label = 'Slug'): string {
    const s = this.text(value, label, { required: true }).toLowerCase();
    if (s && !SLUG.test(s)) this.fail(`${label} may only use a–z, 0–9 and single hyphens`);
    return s;
  }

  int(value: unknown, label: string, { min = -Infinity, max = Infinity } = {}): number {
    const n = typeof value === 'number' ? value : Number(String(value ?? '').trim());
    if (!Number.isInteger(n)) {
      this.fail(`${label} must be a whole number`);
      return 0;
    }
    if (n < min || n > max) this.fail(`${label} must be between ${min} and ${max}`);
    return n;
  }

  /** A list; each item is read by `read`, with its 1-based row number. */
  list<T>(value: unknown, label: string, read: (item: Record<string, unknown>, row: number) => T, { min = 0, max = 500 } = {}): T[] {
    if (!Array.isArray(value)) {
      this.fail(`${label} must be a list`);
      return [];
    }
    if (value.length < min) this.fail(`Add at least ${min} ${label.toLowerCase()}`);
    if (value.length > max) this.fail(`${label}: ${max} rows at most`);
    return value.slice(0, max).map((item, i) =>
      read(item && typeof item === 'object' ? (item as Record<string, unknown>) : {}, i + 1),
    );
  }
}

export const badRequest = (error: string) => NextResponse.json({ success: false, error }, { status: 400 });

export const conflict = (error: string) => NextResponse.json({ success: false, error }, { status: 409 });

export const notFound = (what = 'Not found') => NextResponse.json({ success: false, error: what }, { status: 404 });

/** Parse a JSON body; a malformed one becomes an empty object. */
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === 'object' ? body : {};
  } catch {
    return {};
  }
}

export const isId = (id: string) => /^\d+$/.test(id);
