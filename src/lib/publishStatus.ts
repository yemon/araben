/**
 * Whether a piece of content is live. Scenarios, surahs, hidden-word
 * categories and trace words each carry one; only published ones reach the
 * site, drafts are seen in the admin alone.
 */
export const PUBLISH_STATUSES = ['draft', 'published'] as const;

export type PublishStatus = (typeof PUBLISH_STATUSES)[number];

export const isPublishStatus = (value: unknown): value is PublishStatus =>
  PUBLISH_STATUSES.includes(value as PublishStatus);
