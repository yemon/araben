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
}: Props) {
  const t = useT();

  const resolvedTitle = titleKey ? t(titleKey) : title;
  const resolvedLead = leadKey ? t(leadKey) : lead;
  const resolvedEyebrow = isDictLeaf(eyebrow) ? t(eyebrow) : (eyebrow as string | undefined);
  const resolvedMeta = isDictLeaf(meta) ? t(meta) : (meta as string | undefined);

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
