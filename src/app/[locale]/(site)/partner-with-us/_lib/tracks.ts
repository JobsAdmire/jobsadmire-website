import type { FormKey } from '@/analytics/forms';

/** The three partnership tracks, in the design's card order. */
export const TRACK_KEYS = ['hr', 'sourcing', 'institute'] as const;
export type TrackKey = (typeof TRACK_KEYS)[number];

/** Catalog v1.1 `partner.track` (W16) — the same pair `PARAM_ENUMS.track` allows on
 *  `partner_track_select` (W26/W67); `tracks.test.ts` pins the two lists together. */
export const PARTNER_TRACKS = ['sourcing', 'institute'] as const;
export type PartnerTrack = (typeof PARTNER_TRACKS)[number];

export const isPartnerTrack = (key: TrackKey): key is PartnerTrack =>
  (PARTNER_TRACKS as readonly string[]).includes(key);

/** The design's default panel (`track: 'hr'`). Showing it is not a visitor signal (W67). */
export const DEFAULT_TRACK: TrackKey = 'hr';

/** W3: the HR agency is an employer-side client for the Turkey sales team (`hire`, `iAm:
 *  'hr_agency'`); the other two are supply-side partners (`partner`, `track`). */
export const FORM_KEY_BY_TRACK: Record<TrackKey, FormKey> = {
  hr: 'hire',
  sourcing: 'partner',
  institute: 'partner',
};

/** The form cards' anchors — the design's own ids, the mobile jump links' targets. */
export const FORM_ANCHOR: Record<TrackKey, string> = {
  hr: 'apply-hr',
  sourcing: 'apply-agent',
  institute: 'apply-inst',
};

/** `FormShell idScope` per shell: sourcing and institute share the `partner` key, so each shell
 *  scopes its own ids (`f-partner-sourcing-consent` …) even though one mounts at a time (W79). */
export const FORM_ID_SCOPE: Record<TrackKey, string> = {
  hr: 'partner-hr',
  sourcing: 'partner-sourcing',
  institute: 'partner-institute',
};

/** The URL fragment for a track — also the card radio's own id, so a campaign deep link
 *  (`/ortak-olun#track-sourcing`) lands on the card it preselects. */
export const trackHash = (key: TrackKey) => `#track-${key}`;

/** `#track-<key>` → the key; any other fragment → null. */
export function trackFromHash(hash: string): TrackKey | null {
  const key = /^#track-([a-z]+)$/.exec(hash)?.[1];
  return key && (TRACK_KEYS as readonly string[]).includes(key) ? (key as TrackKey) : null;
}
