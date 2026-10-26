/**
 * The content parser's slugify (scripts/parse-content.mjs), kept identical so
 * slugs made in the admin match the ones the guide produces.
 */
export function slugify(input: string): string {
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['`]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
