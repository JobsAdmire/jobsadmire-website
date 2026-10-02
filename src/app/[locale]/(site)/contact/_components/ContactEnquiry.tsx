'use client';
import { usePathname } from 'next/navigation';
import { useId, useState, type ReactNode } from 'react';
import { track } from '@/analytics/track';
import { RadioChips } from '@/design/primitives/RadioChips';
import { Field } from '@/forms/client/Field';
import { FormShell } from '@/forms/client/FormShell';
import {
  EXTRA_FIELD,
  PICKER_TOPICS,
  REPLY_CHANNELS,
  type ContactTopic,
  type PickerTopic,
  type ReplyChannel,
} from '../_lib/options';
import { ChainLinkIcon, CheckMarkIcon, DocumentIcon, SearchIcon, UsersIcon } from './icons';
import type { FormAction, FormDoor } from './types';

export type TopicCardCopy = { label: string; sub: string };

export type TopicFormCopy = {
  title: string;
  sub: string;
  desk: string;
  companyLabel: string;
  companyPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  /** hire/permit: the `city` label (its placeholder is the kernel's `sys.form.placeholders.city`);
   *  partner: the licence label and placeholder. */
  extraLabel: string;
  extraPlaceholder?: string;
  submit: string;
};

export type ContactEnquiryCopy = {
  legend: string;
  topics: Record<PickerTopic, TopicCardCopy>;
  forms: Record<ContactTopic, TopicFormCopy>;
  deskPrefix: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  phoneLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  replyLegend: string;
  reply: Record<ReplyChannel, string>;
  moreOpen: string;
  moreClose: string;
  fallbackIntro: string;
};

export type ContactEnquiryProps = FormDoor & {
  action: FormAction;
  copy: ContactEnquiryCopy;
  /** The job-seeker explainer (contact.075–085), server-rendered by the page. */
  jobPanel: ReactNode;
  /** The "Rather email? →" line (contact.074), rendered under the form, outside it. */
  footer: ReactNode;
};

const TOPIC_ICON: Record<PickerTopic, ReactNode> = {
  hire: <UsersIcon size={18} />,
  permit: <DocumentIcon size={18} />,
  partner: <ChainLinkIcon size={18} />,
  job: <SearchIcon size={18} />,
};

const TILE: Record<PickerTopic, string> = {
  hire: 'bg-tint text-blue-safe',
  permit: 'bg-tint text-blue-safe',
  partner: 'bg-pale-1 text-navy',
  job: 'bg-success-surface text-success-text',
};

/** The checked face per topic: only the border colour moves (a tinted face would drop the sub
 *  line's text-tertiary below 4.5:1, D20). */
const CHECKED: Record<PickerTopic, string> = {
  hire: 'has-[:checked]:border-blue-safe',
  permit: 'has-[:checked]:border-blue-safe',
  partner: 'has-[:checked]:border-navy',
  job: 'has-[:checked]:border-success-text',
};

const CARD =
  'group relative flex cursor-pointer items-center gap-3 rounded-sm border-2 border-border-3 bg-white p-3 pr-8 text-left transition-colors hover:bg-pale-3 has-[:checked]:shadow-[0_8px_20px_rgba(22,60,90,0.1)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-safe max-md:flex-col max-md:items-start';
const TILE_BASE = 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xs';

/** The design's message card: the topic picker (native radios — arrow keys, focus and the checked
 *  state come from the platform, D20) over the `contact` form, or the job-seeker explainer when the
 *  visitor picks "I am looking for a job" — which files nothing (W3). */
export function ContactEnquiry({
  action,
  copy,
  jobPanel,
  footer,
  locale,
  turnstileSiteKey,
  whatsappNumber,
  contact,
}: ContactEnquiryProps) {
  // R35: `page` is the real URL (next/navigation), never next-intl's internal key.
  const page = usePathname() ?? '/';
  const extraId = useId();
  const notesId = useId();
  const [topic, setTopic] = useState<PickerTopic>('hire');
  const [reply, setReply] = useState<string>('whatsapp');
  const [more, setMore] = useState(false);
  const formTopic: ContactTopic | null = topic === 'job' ? null : topic;
  const form = formTopic ? copy.forms[formTopic] : null;

  const pick = (key: PickerTopic) => {
    setTopic(key);
    // W12/W67: the enum key only — never a label, never a field value.
    track('contact_topic', { page, locale, topic: key });
  };

  return (
    <>
      <div className="px-6 pt-6 md:px-8">
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-3 p-0 text-eyebrow font-extrabold uppercase tracking-[0.6px] text-text-tertiary">
            {copy.legend}
          </legend>
          <div className="grid grid-cols-2 gap-2.5">
            {PICKER_TOPICS.map((key) => (
              <label key={key} className={[CARD, CHECKED[key]].join(' ')}>
                <input
                  type="radio"
                  name="topicPick"
                  value={key}
                  checked={topic === key}
                  onChange={() => pick(key)}
                  className="sr-only"
                />
                <span aria-hidden="true" className={[TILE_BASE, TILE[key]].join(' ')}>
                  {TOPIC_ICON[key]}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-body-sm font-extrabold text-ink">
                    {copy.topics[key].label}
                  </span>
                  <span className="text-body-sm text-text-tertiary">{copy.topics[key].sub}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-blue-safe text-white group-has-[:checked]:flex"
                >
                  <CheckMarkIcon size={12} />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <div aria-hidden="true" className="mx-6 mt-5 h-px bg-border-3 md:mx-8" />
      {formTopic && form ? (
        <>
          <FormShell
            action={action}
            formKey="contact"
            idScope="contact-enquiry"
            locale={locale}
            turnstileSiteKey={turnstileSiteKey}
            whatsappNumber={whatsappNumber}
            whatsappIntro={copy.fallbackIntro}
            contact={contact}
            submitLabel={form.submit}
            consent="checkbox"
            title={form.title}
            headingLevel={3}
            testId="contact-enquiry-form"
            className="px-6 pt-6 md:px-8"
          >
            <input type="hidden" name="topic" value={formTopic} />
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="m-0 max-w-[46ch] text-body-sm text-text-tertiary">{form.sub}</p>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-pill border border-border-2 bg-pale-1 px-3 py-1 text-body-sm font-extrabold text-text-secondary">
                <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-success" />
                {copy.deskPrefix} {form.desk}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field
                name="company"
                label={form.companyLabel}
                placeholder={form.companyPlaceholder}
                required
                autoComplete="organization"
                maxLength={200}
              />
              <Field
                name="name"
                label={copy.nameLabel}
                placeholder={copy.namePlaceholder}
                required
                autoComplete="name"
                maxLength={120}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field
                name="email"
                type="email"
                label={copy.emailLabel}
                required
                autoComplete="email"
                inputMode="email"
                maxLength={254}
              />
              <Field
                name="phone"
                type="tel"
                label={copy.phoneLabel}
                required
                autoComplete="tel"
                inputMode="tel"
                maxLength={40}
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.3fr_0.7fr]">
              <Field
                name="subject"
                label={form.subjectLabel}
                placeholder={form.subjectPlaceholder}
                required
                maxLength={200}
              />
              {/* ≤ 700 px the optional inputs sit behind "+ Add extra details" (contact.211/210). */}
              <div id={extraId} className={more ? 'min-w-0' : 'min-w-0 max-md:hidden'}>
                {EXTRA_FIELD[formTopic] === 'city' ? (
                  <Field
                    key="city"
                    name="city"
                    label={form.extraLabel}
                    autoComplete="address-level2"
                    maxLength={120}
                  />
                ) : (
                  <Field
                    key="licence"
                    name="licence"
                    label={form.extraLabel}
                    placeholder={form.extraPlaceholder}
                    maxLength={200}
                  />
                )}
              </div>
            </div>
            <button
              type="button"
              aria-expanded={more}
              aria-controls={`${extraId} ${notesId}`}
              onClick={() => setMore((v) => !v)}
              className="flex min-h-[46px] w-full items-center justify-center rounded-xs border-[1.5px] border-dashed border-tint-border bg-pale-1 px-3 text-body-sm font-extrabold text-blue-safe md:hidden"
            >
              {more ? copy.moreClose : copy.moreOpen}
            </button>
            <div id={notesId} className={more ? 'min-w-0' : 'min-w-0 max-md:hidden'}>
              <Field
                name="message"
                as="textarea"
                rows={3}
                label={copy.notesLabel}
                placeholder={copy.notesPlaceholder}
                hint=""
                maxLength={4000}
              />
            </div>
            <RadioChips
              name="reply"
              legend={copy.replyLegend}
              value={reply}
              onChange={setReply}
              options={REPLY_CHANNELS.map((c) => ({ value: c, label: copy.reply[c] }))}
            />
          </FormShell>
          <div className="px-6 pb-7 pt-4 md:px-8">{footer}</div>
        </>
      ) : (
        <div data-testid="contact-jobseeker" className="px-6 pb-7 pt-6 md:px-8">
          {jobPanel}
        </div>
      )}
    </>
  );
}
