/**
 * The 17 door-backed form instances across the 13 designed pages, as data — T14's own record
 * of what the BUILT pages under `src/app/[locale]/(site)/**` render, re-read directly from
 * their code on 2026-10-02 (W199: the code wins over any table — every `testId`, `idScope`,
 * DOM `name` and required flag below was checked against the page's FormShell, its zod schema
 * and its `toFields`; `scripts/form-instances.test.ts` pins the `testId`/`idScope` literals, every
 * field `name`, every `open`-selector token and every select/radio value to the page sources). Corrected along the way against ruling W105 (careers' own country, the
 * #pool/#pool-form anchor, the sourcing track's required licence, T8/T10's under-reported
 * required fields). `e2e/door-test-mode.spec.ts` (Cycle 5) iterates this; the Cycle 7 manual
 * table is filled by hand from the same 17 rows so the two never diverge. Not imported by
 * `src/**` — a fixture, not runtime code.
 */
import type { FormKey } from '../../src/analytics/forms';

export type FieldKind = 'text' | 'email' | 'tel' | 'select' | 'radio' | 'checkbox' | 'textarea';

export type FieldFill = {
  /** the DOM control's `name` attribute — exactly what the page's schema/toFields names it,
   *  never the door's wire name where the two differ (e.g. row 11 fills `day`/`slot`, which
   *  the page's `toCallbackFields` composes into the wire's `preferredTime`). */
  name: string;
  kind: FieldKind;
  /** the value to fill/select; `{stamp}` is replaced with a per-run unique token at test time. */
  value: string;
  required: boolean;
};

export type DynamicOpening = { country: 'TR' | 'PK' };

export type FormInstance = {
  id: number;
  page: string;
  /** which locale this specific instance is exercised in (both hire keys together cover both). */
  locale: 'tr' | 'en';
  path: { tr: string; en: string };
  /** informational only — the section/card id the design anchors this instance to. */
  anchor?: string;
  /** a page-wide selector the spec clicks BEFORE filling, when this instance's form is not
   *  mounted on arrival: the hero's "call me back" mode (T1 renders one shell at a time), a
   *  Partner track card (T5 mounts one track's form at a time), a Contact topic card (T7's
   *  `topicPick` picker sits outside the form and drives its hidden `topic` input), the Contact
   *  call-back widget's toggle (T7 mounts that form only while the widget is expanded). */
  open?: string;
  /** the viewport the automated spec sets before `goto` when the instance exists only at a
   *  phone width (row 2: the hero's mode buttons are `xs:hidden` — ≤ 460 px). Unset = the
   *  desktop project's 1440 × 900. */
  viewport?: { width: number; height: number };
  mode: string;
  doorKey: FormKey;
  testId: string;
  idScope?: string;
  consentMode: 'checkbox' | 'notice';
  /** values the page sends but the visitor never types (e.g. `country: 'TR'` on the HR-agency
   *  track, `office: 'antalya'` on book-a-visit) — informational for the manual table (Cycle 7),
   *  not filled by the automated spec (nothing to fill). */
  fixedFields?: Record<string, string>;
  fields: readonly FieldFill[];
  /** careers only: the automated spec resolves the opening at run time from the live
   *  `GET /api/careers/openings` list — no slug is ever hardcoded here (it would go stale the
   *  day an opening closes). `path.tr`/`path.en` for these two rows are the INDEX route; the
   *  detail route is built once the slug is known. */
  dynamicOpening?: DynamicOpening;
  notes?: string;
};

export const requiredFieldNames = (row: FormInstance): string[] =>
  row.fields.filter((f) => f.required).map((f) => f.name);

/** Puts the run's `{stamp}` inside a value's `[T14-nn]` tag (`[T14-01] Ayşe` → `[T14-01 {stamp}] Ayşe`),
 *  so every run's body differs and never dedupes onto an earlier row in the same clock hour (the door
 *  hashes `fields`; `sourcePath` is not hashed). A value without a tag (an e-mail) is unchanged. */
const t = (s: string) => s.replace(']', ' {stamp}]');

export const FORM_INSTANCES: readonly FormInstance[] = [
  {
    id: 1,
    page: 'Homepage (T1)',
    locale: 'tr',
    path: { tr: '/', en: '/en' },
    anchor: '#proposal',
    mode: 'hero lead form, proposal mode',
    doorKey: 'hire',
    testId: 'hire-form',
    idScope: 'hero-hire',
    consentMode: 'checkbox',
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-01] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-01] Ayşe Yılmaz'), required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-01@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000001', required: true },
      { name: 'headcount', kind: 'text', value: '5', required: true },
      { name: 'sector', kind: 'select', value: 'factory', required: false },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
      { name: 'startWhen', kind: 'select', value: 'month1', required: false },
    ],
    notes:
      'No roleNeeded, no message field on this instance — the hero schema does not carry them (HeroLeadForm.tsx / _home/lib/forms.ts). The three optional controls are `max-xs:hidden`; at the desktop viewport they are visible and filled.',
  },
  {
    id: 2,
    page: 'Homepage (T1)',
    locale: 'en',
    path: { tr: '/', en: '/en' },
    anchor: '#proposal',
    mode: 'hero lead form, "call me back" mode',
    doorKey: 'callback',
    testId: 'callback-form',
    idScope: 'hero-callback',
    open: '[data-testid="hero-mode-callback"]',
    viewport: { width: 390, height: 844 },
    consentMode: 'checkbox',
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-02] John Smith'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000002', required: true },
      { name: 'topic', kind: 'select', value: 'factory', required: false },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
    ],
    notes:
      'Built page (HeroLeadForm.tsx): the two mode buttons sit in an `xs:hidden` block, so the callback mode exists only at ≤ 460 px — the spec sets a 390 px viewport for this row. Its `topic`/`city` controls are `max-xs:hidden` and therefore never visible in callback mode: the spec skips an optional control that is not visible, and the wire carries only name + phone (recorded as the wire names anyway). No preferredTime control (different shape from rows 11/12 on Contact).',
  },
  {
    id: 3,
    page: 'Hire Workers (T2)',
    locale: 'tr',
    path: { tr: '/isci-talebi', en: '/en/hire-workers' },
    anchor: '#request-form',
    mode: 'quick-quote (≥ 701 px)',
    doorKey: 'hire',
    testId: 'hire-form-quick',
    idScope: 'hire-quick',
    consentMode: 'checkbox',
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-03] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-03] Ayşe Yılmaz'), required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: true },
      { name: 'roleNeeded', kind: 'text', value: 'Welder', required: true },
      { name: 'headcount', kind: 'text', value: '5', required: true },
      { name: 'phone', kind: 'tel', value: '+905000000003', required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-03@jobsadmire.com'),
        required: true,
      },
    ],
    notes:
      'The page sets consent="checkbox" (QuickQuote.tsx), not "notice" as an earlier draft assumed. Every field here is required — the quick schema has no optional field. The card is `max-md:hidden` (desktop only).',
  },
  {
    id: 4,
    page: 'Hire Workers (T2)',
    locale: 'en',
    path: { tr: '/isci-talebi', en: '/en/hire-workers' },
    anchor: '#request-form',
    mode: 'detailed request form',
    doorKey: 'hire',
    testId: 'hire-form-full',
    idScope: 'hire-full',
    consentMode: 'checkbox',
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-04] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-04] John Smith'), required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-04@jobsadmire.com'),
        required: true,
      },
      { name: 'dial', kind: 'select', value: 'TR', required: true },
      { name: 'phone', kind: 'tel', value: '5000000004', required: true },
      { name: 'sector', kind: 'select', value: 'factory', required: true },
      { name: 'roleNeeded', kind: 'text', value: 'Welder', required: true },
      { name: 'headcount', kind: 'text', value: '3', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
      { name: 'startWhen', kind: 'select', value: 'month1', required: false },
      {
        name: 'message',
        kind: 'textarea',
        value: 'T14 staging run {stamp} — please ignore.',
        required: false,
      },
    ],
    notes:
      '`dial` + `phone` compose into the wire’s single `phone` (+90…); `sector` is REQUIRED on this instance (an enum, not optional — RequestForm.tsx / hire-spec.ts).',
  },
  {
    id: 5,
    page: 'Cost Calculator (T3)',
    locale: 'tr',
    path: { tr: '/maliyet-hesaplayici', en: '/en/hiring-cost-calculator' },
    anchor: '#calculator',
    mode: 'written quote, opened from the calculator card after estimating (CNC operator, 8 workers, 12 months)',
    doorKey: 'calculator',
    testId: 'calc-quote-form',
    idScope: 'calc-quote',
    consentMode: 'checkbox',
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-05] Ayşe Yılmaz'), required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-05@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000005', required: false },
      { name: 'company', kind: 'text', value: t('[T14-05] Door Smoke Ltd'), required: false },
      { name: 'country', kind: 'select', value: 'TR', required: false },
    ],
    notes:
      'The card’s own anchor id is `#calculator` (W152/W158); the sheet opens from `[data-testid="calc-quote-open"]` in `calc-total-card` (visible at the desktop width; `calc-quote-open-band` is the all-widths twin). `trade`/`headcount`/`durationMonths`/`estimateSummary` are recomputed server-side from the sheet’s hidden `est_*` inputs, never typed — the automated spec runs the calculator (role, headcount; the contract stays at its 12-month default) before opening the sheet.',
  },
  {
    id: 6,
    page: 'Partner With Us (T5)',
    locale: 'en',
    path: { tr: '/ortak-olun', en: '/en/partner-with-us' },
    anchor: '#tracks',
    mode: 'HR-agency track',
    doorKey: 'hire',
    testId: 'partner-form-hr',
    idScope: 'partner-hr',
    consentMode: 'checkbox',
    fixedFields: { country: 'TR', iAm: 'hr_agency' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-06] Door Smoke Agency'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-06] John Smith'), required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-06@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000006', required: true },
      {
        name: 'message',
        kind: 'textarea',
        value: 'T14 staging run {stamp} — please ignore.',
        required: false,
      },
    ],
    notes:
      '`city` is REQUIRED on this track (PartnerForms.tsx / _lib/forms.ts); `country`/`iAm` are fixed by the page, never a control. The HR panel is the default track, mounted on arrival.',
  },
  {
    id: 7,
    page: 'Partner With Us (T5)',
    locale: 'tr',
    path: { tr: '/ortak-olun', en: '/en/partner-with-us' },
    anchor: '#tracks',
    mode: 'sourcing-partner track',
    doorKey: 'partner',
    testId: 'partner-form-sourcing',
    idScope: 'partner-sourcing',
    consentMode: 'checkbox',
    open: 'label[for="track-sourcing"]',
    fixedFields: { track: 'sourcing' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-07] Door Smoke Sourcing'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-07] Ayşe Yılmaz'), required: true },
      { name: 'country', kind: 'select', value: 'PK', required: true },
      { name: 'licence', kind: 'text', value: 'LIC-T14-07', required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-07@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000007', required: true },
      { name: 'candidatesPerYear', kind: 'text', value: '50', required: false },
      { name: 'trades', kind: 'textarea', value: 'welder, cnc operator', required: false },
      { name: 'licenceDeclaration', kind: 'checkbox', value: 'on', required: true },
    ],
    notes:
      'W105: `licence` is REQUIRED here, and this track sends NO `city` and NO `message` (the sourcing schema has neither). `licenceDeclaration` is a page-local tick, never sent on the wire. `trades` is a textarea on the built page. The track radio `#track-sourcing` (`name="partner-track"`) is toggled through its label.',
  },
  {
    id: 8,
    page: 'Partner With Us (T5)',
    locale: 'en',
    path: { tr: '/ortak-olun', en: '/en/partner-with-us' },
    anchor: '#tracks',
    mode: 'training-institute track',
    doorKey: 'partner',
    testId: 'partner-form-institute',
    idScope: 'partner-institute',
    consentMode: 'checkbox',
    open: 'label[for="track-institute"]',
    fixedFields: { track: 'institute' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-08] Door Smoke Institute'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-08] John Smith'), required: true },
      { name: 'country', kind: 'select', value: 'NP', required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-08@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000008', required: true },
      { name: 'city', kind: 'text', value: 'Kathmandu', required: false },
      { name: 'candidatesPerYear', kind: 'text', value: '20', required: false },
      { name: 'trades', kind: 'textarea', value: 'welder', required: false },
    ],
    notes:
      'This track has no `licence` field and no `message` field at all (the institute schema).',
  },
  {
    id: 9,
    page: 'Contact (T7)',
    locale: 'tr',
    path: { tr: '/iletisim', en: '/en/contact' },
    anchor: '#message',
    mode: 'enquiry, topic hire',
    doorKey: 'contact',
    testId: 'contact-enquiry-form',
    idScope: 'contact-enquiry',
    consentMode: 'checkbox',
    open: 'label:has(input[name="topicPick"][value="hire"])',
    fixedFields: { iAm: 'direct_employer' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-09] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-09] Ayşe Yılmaz'), required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-09@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000009', required: true },
      { name: 'subject', kind: 'text', value: 'Need 5 welders', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
      {
        name: 'message',
        kind: 'textarea',
        value: 'T14 staging run {stamp} — please ignore.',
        required: false,
      },
    ],
    notes:
      'The topic is picked on T7’s `topicPick` card (outside the form; it sets the form’s hidden `topic` input — never a fillable control). Wire `iAm` = IAM_BY_TOPIC.hire = direct_employer (fixed by topic, never typed); wire `message` is always non-empty (composeContactMessage prepends the subject and the `reply` chip, default whatsapp). `city`/`message` are `max-md:hidden` behind the "add extra details" button on phones; visible at the desktop width.',
  },
  {
    id: 10,
    page: 'Contact (T7)',
    locale: 'en',
    path: { tr: '/iletisim', en: '/en/contact' },
    anchor: '#message',
    mode: 'enquiry, topic permit (also proves the job topic renders no form)',
    doorKey: 'contact',
    testId: 'contact-enquiry-form',
    idScope: 'contact-enquiry',
    consentMode: 'checkbox',
    open: 'label:has(input[name="topicPick"][value="permit"])',
    fixedFields: { iAm: 'direct_employer' },
    fields: [
      { name: 'company', kind: 'text', value: t('[T14-10] Door Smoke Ltd'), required: true },
      { name: 'name', kind: 'text', value: t('[T14-10] John Smith'), required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-10@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000010', required: true },
      { name: 'subject', kind: 'text', value: 'Work permit question', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
    ],
    notes:
      '`iAm` for the permit topic is direct_employer (IAM_BY_TOPIC.permit — confirmed in contact/_lib/forms.ts). Cross-check (not filled): selecting the `job` topic unmounts the form entirely (W3) and shows `contact-jobseeker` — record this as a separate pass/fail line, not a submission.',
  },
  {
    id: 11,
    page: 'Contact (T7)',
    locale: 'tr',
    path: { tr: '/iletisim', en: '/en/contact' },
    anchor: '#message',
    mode: 'callback widget',
    doorKey: 'callback',
    testId: 'contact-callback-form',
    idScope: 'contact-callback',
    consentMode: 'checkbox',
    open: '[data-testid="contact-callback"] button[aria-expanded="false"]',
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-11] Ayşe Yılmaz'), required: true },
      { name: 'phone', kind: 'tel', value: '+905000000011', required: true },
      { name: 'day', kind: 'radio', value: 'tomorrow', required: false },
      { name: 'slot', kind: 'radio', value: '14-16', required: false },
    ],
    notes:
      'DOM names `day`/`slot` (RadioChips); `toCallbackFields` composes wire `preferredTime` = "tomorrow 14-16". No `city`, no `topic` on THIS callback (unlike row 2’s homepage callback). The widget starts closed and T7 renders no form until its toggle is clicked — hence `open`.',
  },
  {
    id: 12,
    page: 'Contact (T7)',
    locale: 'en',
    path: { tr: '/iletisim', en: '/en/contact' },
    anchor: '#message',
    mode: 'book a visit',
    doorKey: 'visit',
    testId: 'contact-visit-form',
    idScope: 'contact-visit',
    consentMode: 'checkbox',
    fixedFields: { office: 'antalya' },
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-12] John Smith'), required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-12@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000012', required: true },
      { name: 'preferredTime', kind: 'radio', value: '11:00', required: false },
    ],
    notes:
      'T7 renders both visit controls as RadioChips: `preferredTime` = the five `VISIT_SLOTS`; `preferredDate` = the next five open dates, computed at render — no fixed value can match, so the automated run leaves the date unset (optional at the door) and Cycle 7 picks one by hand. The form body is `max-md:hidden` behind its toggle on phones; visible at the desktop width.',
  },
  {
    id: 13,
    page: 'Available Workers (T8)',
    locale: 'tr',
    path: { tr: '/adaylar', en: '/en/available-workers' },
    anchor: '#pool-form',
    mode: 'request form, in the hero card',
    doorKey: 'workers',
    testId: 'workers-form',
    consentMode: 'checkbox',
    fixedFields: { country: 'TR' },
    fields: [
      { name: 'iAm', kind: 'radio', value: 'direct_employer', required: true },
      { name: 'name', kind: 'text', value: t('[T14-13] Ayşe Yılmaz'), required: true },
      { name: 'company', kind: 'text', value: t('[T14-13] Door Smoke Ltd'), required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-13@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000013', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: true },
      { name: 'trade', kind: 'text', value: 'Welder, 3 needed', required: true },
      { name: 'headcount', kind: 'text', value: '3', required: false },
      { name: 'startWhen', kind: 'select', value: 'month1', required: false },
      {
        name: 'message',
        kind: 'textarea',
        value: 'T14 staging run {stamp} — please ignore.',
        required: false,
      },
    ],
    notes:
      "W105: the form sits in `#pool-form` inside the hero card, NOT inside `#pool` (the header CTA’s target, which renders only the empty state). `city` and `trade` are REQUIRED on this page; `country: 'TR'` is sent silently, never a control. No `idScope` — the page mounts one `workers` shell, so every id is `f-workers-<name>`.",
  },
  {
    id: 14,
    page: 'Verify (T10)',
    locale: 'en',
    path: { tr: '/temsilci-dogrulama', en: '/en/verify' },
    anchor: '#report',
    mode: 'fraud report, no evidence',
    doorKey: 'fraud',
    testId: 'fraud-form',
    consentMode: 'checkbox',
    fields: [
      { name: 'reporterName', kind: 'text', value: t('[T14-14] John Smith'), required: true },
      {
        name: 'reporterEmail',
        kind: 'email',
        value: t('door-smoke+t14-14@jobsadmire.com'),
        required: true,
      },
      { name: 'reporterPhone', kind: 'tel', value: '+905000000014', required: false },
      {
        name: 'description',
        kind: 'textarea',
        value: 'T14 staging run {stamp} — synthetic fraud report, please ignore this row entirely.',
        required: true,
      },
      { name: 'suspectName', kind: 'text', value: 'Nobody', required: false },
      { name: 'suspectContact', kind: 'text', value: 'none', required: false },
    ],
    notes:
      'W105: `reporterEmail` is REQUIRED on this page (the door itself allows it blank, but T10’s own schema does not). `description` must stay ≥ 20 characters (the door’s own minimum). No `idScope` — ids are `f-fraud-<name>`.',
  },
  {
    id: 15,
    page: 'Verify (T10)',
    locale: 'tr',
    path: { tr: '/temsilci-dogrulama', en: '/en/verify' },
    anchor: '#report',
    mode: 'fraud report with three evidence files',
    doorKey: 'fraud',
    testId: 'fraud-form',
    consentMode: 'checkbox',
    fields: [
      { name: 'reporterName', kind: 'text', value: t('[T14-15] Ayşe Yılmaz'), required: true },
      {
        name: 'reporterEmail',
        kind: 'email',
        value: t('door-smoke+t14-15@jobsadmire.com'),
        required: true,
      },
      { name: 'reporterPhone', kind: 'tel', value: '+905000000015', required: false },
      {
        name: 'description',
        kind: 'textarea',
        value:
          'T14 staging run {stamp} — synthetic fraud report with evidence, please ignore this row entirely.',
        required: true,
      },
      { name: 'suspectName', kind: 'text', value: 'Nobody', required: false },
      { name: 'suspectContact', kind: 'text', value: 'none', required: false },
    ],
    notes:
      'As row 14, plus three evidence uploads (`t14-1.jpg`, `t14-2.png`, `t14-3.pdf`), each ≤ 3 MiB (W73/W116 — not the 8 MB the door itself would accept; the site refuses anything larger before the door sees it). The evidence island (`data-testid="fraud-evidence"`) is one unnamed `<input type="file" multiple>`; it uploads one server-action call per file (W101) and renders one hidden `evidenceKeys` input per stored file — the fourth file the `MAX_EVIDENCE_FILES = 3` control refuses is a UI check, not a wire submission. Runs only in Cycle 7 (W171).',
  },
  {
    id: 16,
    page: 'Careers detail (T11)',
    locale: 'tr',
    path: { tr: '/kariyer', en: '/en/careers' },
    anchor: '#apply',
    mode: 'standard apply, CV upload, residency lock (TR opening)',
    doorKey: 'careers',
    testId: 'careers-apply-form',
    consentMode: 'checkbox',
    dynamicOpening: { country: 'TR' },
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-16] Ayşe Yılmaz'), required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-16@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000016', required: true },
      { name: 'city', kind: 'text', value: 'Antalya', required: false },
      {
        name: 'coverLetter',
        kind: 'textarea',
        value: 'T14 staging run {stamp} — please ignore.',
        required: false,
      },
    ],
    notes:
      'CV file (`t14-cv.pdf`, ≤ 3 MiB — W73/W116, not the door’s own 5 MB) on T11’s `input[name="cv"]`: it rides in the apply action call itself (one file per call) and `applyToFields` uploads it before the door call — `cvKey` is never a DOM field; `openingSlug` is a hidden input. `country` is a locked select offering only the opening’s own country (`CountryField`) — never typed; the site re-checks it server-side regardless. The live opening is re-read at run time from `GET /api/careers/openings`, never hardcoded. Runs only in Cycle 7 (W171).',
  },
  {
    id: 17,
    page: 'Careers detail (T11)',
    locale: 'en',
    path: { tr: '/kariyer', en: '/en/careers' },
    anchor: '#apply',
    mode: 'standard apply, PK opening — the expectedSalary branch',
    doorKey: 'careers',
    testId: 'careers-apply-form',
    consentMode: 'checkbox',
    dynamicOpening: { country: 'PK' },
    fields: [
      { name: 'name', kind: 'text', value: t('[T14-17] John Smith'), required: true },
      {
        name: 'email',
        kind: 'email',
        value: t('door-smoke+t14-17@jobsadmire.com'),
        required: true,
      },
      { name: 'phone', kind: 'tel', value: '+905000000017', required: true },
      { name: 'expectedSalary', kind: 'text', value: '150000', required: true },
      {
        name: 'coverLetter',
        kind: 'textarea',
        value: 'T14 staging run {stamp} — please ignore.',
        required: false,
      },
    ],
    notes:
      '`expectedSalary` is rendered and REQUIRED only because the opening’s own country is PK (`applyToFields` throws a field error otherwise); `expectedSalaryCurrency` is set server-side from the opening’s `payCurrency` (PKR fallback), never typed. The live PK opening is re-read at run time, never hardcoded. Runs only in Cycle 7 (W171).',
  },
];

/** Rendered on a designed page but never a door submission — recorded in the Cycle 7/9 ledger,
 *  not run through `e2e/door-test-mode.spec.ts`. */
export const NON_DOOR_INSTANCES: readonly { label: string; note: string }[] = [
  {
    label: 'Careers detail — portfolio-required apply-by-e-mail branch',
    note: 'No live opening has portfolioRequired=true as of the last check; covered by T11’s unit/e2e only (W3/W56) — `careers-email-apply`.',
  },
  {
    label: 'Join Our Team — speculative application',
    note: 'WhatsApp + mailto only, no door key (W3); click both, assert email_click/whatsapp_click with page_cta.',
  },
  {
    label: 'Verify — representative lookup',
    note: 'Client-only, neutral W6 result; verify_lookup outcome register_unavailable.',
  },
  {
    label: 'newsletter band',
    note: 'Hidden on every page in Phase A (W5, `NEWSLETTER_ACTIVE=false`) — assert no form[data-form-key="newsletter"] exists on /blog, /en/blog, /.',
  },
  {
    label: 'newsletter confirm/unsubscribe pages',
    note: 'I12 — buttons, not forms; forwarded only on click, never generate_lead/conversion (D13); exercised in Cycle 7 (the I12 step), not as a door instance.',
  },
];
