'use client';

import { useT } from '@/lib/i18n/t';
import { dict } from '@/lib/i18n/dict';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';

type DictLeaf = { bn: string; en: string };

interface Props {
  crumbs: Crumb[];
  eyebrow?: DictLeaf | string;
  titleKey?: DictLeaf;
  title?: string;
  leadKey?: DictLeaf;
  lead?: string;
  meta?: DictLeaf | string;
  banglaSubtitle?: string;
  // A tighter heading for pages where the content below (a video) should
  // be on screen without scrolling: eyebrow beside the title, smaller type,
  // less space around it.
  compact?: boolean;
}

function isDictLeaf(x: any): x is DictLeaf {
  return x && typeof x === 'object' && 'bn' in x && 'en' in x;
}

export function PageIntro({
  crumbs,
  eyebrow,
  titleKey,
  title,
  leadKey,
  lead,
  meta,
  banglaSubtitle,
  compact = false,
}: Props) {
  const t = useT();

  const resolvedTitle = titleKey ? t(titleKey) : title;
  const resolvedLead = leadKey ? t(leadKey) : lead;
  const resolvedEyebrow = isDictLeaf(eyebrow) ? t(eyebrow) : (eyebrow as string | undefined);
  const resolvedMeta = isDictLeaf(meta) ? t(meta) : (meta as string | undefined);

  if (compact) {
    return (
      <div className="mb-5">
        <Breadcrumbs items={crumbs} className="mb-3" />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {resolvedEyebrow && (
            <span className="chip chip-accent shrink-0 uppercase tracking-wider text-[10px]">{resolvedEyebrow}</span>
          )}
          {resolvedTitle && (
            <h1 className="display text-[1.75rem] md:text-[2.375rem]">
              <span className="underline-flourish">{resolvedTitle}</span>
            </h1>
          )}
        </div>
        {banglaSubtitle && (
          <p className="bn mt-1.5 text-base text-muted" lang="bn">
            {banglaSubtitle}
          </p>
        )}
        {resolvedMeta && <p className="mt-2 text-xs uppercase tracking-wider text-muted">{resolvedMeta}</p>}
        {resolvedLead && <p className="read-body mt-3">{resolvedLead}</p>}
      </div>
    );
  }

  return (
    <div className="mb-10">
      <Breadcrumbs items={crumbs} />
      {resolvedEyebrow && (
        <div className="chip chip-accent mb-4 uppercase tracking-wider text-[10px]">
          {resolvedEyebrow}
        </div>
      )}
      {resolvedTitle && (
        <h1 className="display text-3xl md:text-5xl mb-2">
          <span className="underline-flourish">{resolvedTitle}</span>
        </h1>
      )}
      {banglaSubtitle && (
        <p className="bn text-lg text-muted mt-1" lang="bn">
          {banglaSubtitle}
        </p>
      )}
      {resolvedMeta && (
        <p className="text-xs text-muted uppercase tracking-wider mt-3">
          {resolvedMeta}
        </p>
      )}
      {resolvedLead && (
        <p className="read-body mt-5">{resolvedLead}</p>
      )}
    </div>
  );
}

export function useDict() {
  return { t: useT(), dict };
}
