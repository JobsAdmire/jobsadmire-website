import type { Founder } from '@/content/collections';
import type { RecordCaps, RecordLabels } from '../_components/RecordDialog';
import type { Representative } from '../_lib/register';

type T = (id: string) => string;

/** The founder's public id — the owner's ruling for the founder strip while the v1.1 register is
 *  unpublished (the register's own founder row wins once it exists). */
export const FOUNDER_PUBLIC_ID = 'JA-REP-001';

/** The record dialog's labels, resolved on the server (W9/W148): package ids where the design
 *  has them, `sys.verify.record.*` for the two it lacks. */
export function recordLabels(t: T, sys: T): RecordLabels {
  return {
    badgeQrHint: t('verify.110'),
    authorisedUntil: t('verify.111'),
    noExpiry: t('verify.241'),
    contact: t('verify.112'),
    languages: t('verify.113'),
    reportsTo: t('verify.114'),
    withJobsAdmire: t('verify.115'),
    desk: t('verify.116'),
    mayDo: t('verify.117'),
    mayNever: t('verify.118'),
    soleSignatory: t('verify.060'),
    copyLink: t('verify.226'),
    copied: t('verify.267'),
    wrong: t('verify.239'),
    close: sys('verify.record.close'),
    status: {
      active: t('verify.046'),
      suspended: t('verify.259'),
      former: sys('verify.record.former'),
    },
    whatsappIntro: t('verify.228'),
  };
}

/** The founder level's "May do / May never" lists — the design's `canOf`/`cannotOf` for
 *  `level === "founder"` (Verify ll. 1320, 1329–1331): company rules about the role, not facts
 *  about a person. */
export function founderCaps(t: T): RecordCaps {
  return {
    can: ['verify.198', 'verify.199', 'verify.200'].map(t),
    never: ['verify.213', 'verify.214', 'verify.218'].map(t),
  };
}

/**
 * The record the founder strip opens. With the v1.1 register, its own founder row. Before it
 * (owner ruling): the published W86 founder row — name, title, photo — with the ruled public id,
 * no expiry, the sole-signatory flag and the company number as the official contact; nothing the
 * page cannot vouch for (no city, desk, languages, start date or line manager — the design's
 * sample values for those, verify.148–150 / 240, are staff-data rows, not facts about the
 * founder).
 */
export function founderRecord(
  founder: Founder,
  registered: Representative | null,
  t: T,
  phoneDisplay: string,
): Representative {
  if (registered) return registered;
  return {
    id: FOUNDER_PUBLIC_ID,
    name: founder.name,
    role: t(founder.titleId),
    level: 'founder',
    desk: null,
    city: '',
    country: '',
    languages: [],
    contact: phoneDisplay,
    validUntil: null,
    reportsTo: null,
    since: null,
    status: 'active',
    canSign: true,
    photo: null,
    updatedAt: '',
  };
}
