/**
 * What a scenario video upload may be — shared by the admin's upload form
 * (to say no before sending) and the server (which checks again).
 */

// Big enough for a few minutes of 1080p.
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

// Formats every current browser plays in <video>.
export const VIDEO_TYPES = {
  'video/mp4': { ext: 'mp4', label: 'MP4' },
  'video/webm': { ext: 'webm', label: 'WebM' },
  'video/ogg': { ext: 'ogv', label: 'Ogg' },
} as const;

export type VideoType = keyof typeof VIDEO_TYPES;

export const isVideoType = (t: string): t is VideoType => t in VIDEO_TYPES;
