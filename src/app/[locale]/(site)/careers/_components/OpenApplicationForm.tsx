'use client';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ContactLink } from '@/analytics/ContactLink';
import { useContactClick } from '@/analytics/useContactClick';
import { ArrowRightIcon } from '@/design/chrome/icons';
import { buttonClassName } from '@/design/primitives/Button';
import { INPUT_CLASS, SELECT_CLASS } from '@/forms/client/Field';
import { waLink } from '@/lib/contact';
import { ChoiceChips } from './ChoiceChips';
import { TickIcon } from './icons';

type Kind = 'overseas' | 'office';
type EngagementChoice = 'fullTime' | 'partTime' | 'project' | 'any';
const ENGAGEMENTS: EngagementChoice[] = ['fullTime', 'partTime', 'project', 'any'];

export type OpenApplicationCopy = {
  kindLabel: string; // jt.097
  kinds: Record<Kind, string>; // jt.284 / jt.285
  /** sys.careers.apply.form.* — the placeholder-only fields' words (their hidden labels too) */
  fields: {
    name: string;
    country: string;
    email: string;
    phone: string;
    role: string;
    about: string;
  };
  engagement: string; // jt.098 — the select's empty option
  engagements: Record<EngagementChoice, string>; // jt.099 / jt.100 / jt.073 / jt.101
  consent: string; // jt.102
  submit: string; // jt.103
  emailCv: string; // jt.104
  note: { lead: string; link: string; tail: string }; // jt.105 / jt.106 / jt.107 (TR empty)
  sent: { title: string; body: string; again: string }; // jt.108 / jt.109 / jt.110
  /** jt.313 – jt.321: the WhatsApp message's intro and line labels */
  message: {
    intro: string;
    kind: string;
    name: string;
    country: string;
    email: string;
    whatsapp: string;
    role: string;
    engagement: string;
    about: string;
  };
};

/** The design's message (`submitApp`, Join Our Team ll. 1382–1396): the intro, then one
 *  "label value" line per field; an empty optional field prints "-". Built at submit time from
 *  the form, so nothing the visitor typed ever sits in a DOM href (W76/W95). */
export function applicationMessage(
  copy: OpenApplicationCopy,
  kind: Kind,
  get: (name: string) => string,
): string {
  const m = copy.message;
  const engagement = get('engagement') as EngagementChoice;
  return [
    m.intro,
    `${m.kind} ${copy.kinds[kind]}`,
    `${m.name} ${get('name')}`,
    `${m.country} ${get('country')}`,
    `${m.email} ${get('email')}`,
    `${m.whatsapp} ${get('phone')}`,
    `${m.role} ${get('role') || '-'}`,
    `${m.engagement} ${copy.engagements[engagement] ?? engagement}`,
    `${m.about} ${get('about') || '-'}`,
  ].join('\n');
}

/**
 * "Send us your details" (design `#apply` form card, ll. 935–990) — a client island that posts
 * nothing: there is no Operations form key for a speculative application, so, like the design,
 * the submit composes the WhatsApp message from the fields and opens wa.me in a new tab
 * (`whatsapp_click`, `page_cta` — no typed value reaches analytics), then shows the design's
 * "press send in the window that opened" state (`jt.108`–`110`). The browser's own constraint
 * validation guards the required fields and the KVKK tick. Placeholder-only fields with
 * visually hidden labels in the forms kernel's face (`INPUT_CLASS`); kind chips 2-up, fields
 * single-column and full-width pill buttons below 901 px (M13).
 */
export function OpenApplicationForm({
  copy,
  whatsappNumber,
  mailHref,
  portalHref,
}: {
  copy: OpenApplicationCopy;
  whatsappNumber: string;
  mailHref: string;
  portalHref: string;
}) {
  const base = useId();
  const fire = useContactClick('page_cta');
  const [kind, setKind] = useState<Kind>('overseas');
  const [sent, setSent] = useState(false);
  const sentRef = useRef<HTMLParagraphElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    (sent ? sentRef.current : firstRef.current)?.focus();
  }, [sent]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = applicationMessage(copy, kind, (name) => String(data.get(name) ?? '').trim());
    fire('whatsapp');
    window.open(waLink(whatsappNumber, text), '_blank', 'noopener');
    moved.current = true;
    setSent(true);
  };

  if (sent)
    return (
      <div data-testid="careers-open-application-sent" className="flex flex-col gap-3.5">
        <div className="flex items-start gap-[13px] rounded-sm border border-success-soft-border bg-success-soft px-5 py-[18px]">
          <span
            aria-hidden="true"
            className="ja-tick flex h-[34px] w-[34px] flex-none items-center justify-center rounded-pill bg-white text-success"
          >
            <TickIcon size={18} strokeWidth={3} />
          </span>
          <div>
            <p
              ref={sentRef}
              tabIndex={-1}
              className="mb-1 text-[16px] font-extrabold text-ink focus:outline-none xl:text-[12px]"
            >
              {copy.sent.title}
            </p>
            <p className="text-[14px] leading-[1.6] text-text-secondary xl:text-[11px]">
              {copy.sent.body}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            moved.current = true;
            setSent(false);
          }}
          className={buttonClassName('secondary', 'md', 'self-start', {
            shape: 'rect',
            radius: 11,
          })}
        >
          {copy.sent.again}
        </button>
      </div>
    );

  const field = (name: keyof OpenApplicationCopy['fields']) => `${base}-${name}`;
  const hidden = (name: keyof OpenApplicationCopy['fields']) => (
    <label htmlFor={field(name)} className="sr-only">
      {copy.fields[name]}
    </label>
  );
  return (
    <form
      data-testid="careers-open-application"
      onSubmit={onSubmit}
      className="flex flex-col gap-[13px]"
    >
      <ChoiceChips
        name="kind"
        label={copy.kindLabel}
        value={kind}
        onChange={(value) => setKind(value as Kind)}
        look={{
          label: 'mb-2 block max-lg:mb-[7px] max-lg:tracking-[1.1px]',
          row: 'max-lg:grid max-lg:grid-cols-2',
          item: 'max-lg:flex max-lg:min-w-0',
          chip: 'max-lg:min-h-[44px] max-lg:w-full max-lg:px-2.5 max-lg:text-[12.5px] max-lg:leading-[1.25]',
        }}
        options={[
          { value: 'overseas', label: copy.kinds.overseas },
          { value: 'office', label: copy.kinds.office },
        ]}
      />
      <div className="grid gap-[11px] md:grid-cols-2">
        <div>
          {hidden('name')}
          <input
            ref={firstRef}
            id={field('name')}
            name="name"
            required
            autoComplete="name"
            placeholder={copy.fields.name}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          {hidden('country')}
          <input
            id={field('country')}
            name="country"
            required
            autoComplete="address-level2"
            placeholder={copy.fields.country}
            className={INPUT_CLASS}
          />
        </div>
      </div>
      <div className="grid gap-[11px] md:grid-cols-2">
        <div>
          {hidden('email')}
          <input
            id={field('email')}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={copy.fields.email}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          {hidden('phone')}
          <input
            id={field('phone')}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder={copy.fields.phone}
            className={INPUT_CLASS}
          />
        </div>
      </div>
      <div className="grid gap-[11px] md:grid-cols-2">
        <div>
          {hidden('role')}
          <input
            id={field('role')}
            name="role"
            placeholder={copy.fields.role}
            className={INPUT_CLASS}
          />
        </div>
        <div>
          <label htmlFor={`${base}-engagement`} className="sr-only">
            {copy.engagement}
          </label>
          <select
            id={`${base}-engagement`}
            name="engagement"
            required
            defaultValue=""
            className={`${INPUT_CLASS} ${SELECT_CLASS}`}
          >
            <option value="">{copy.engagement}</option>
            {ENGAGEMENTS.map((value) => (
              <option key={value} value={value}>
                {copy.engagements[value]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        {hidden('about')}
        <textarea
          id={field('about')}
          name="about"
          rows={3}
          placeholder={copy.fields.about}
          className={`${INPUT_CLASS} resize-y`}
        />
      </div>
      <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] leading-[1.55] font-semibold text-text-tertiary xl:text-[11px]">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 flex-none accent-blue-safe"
        />
        <span>{copy.consent}</span>
      </label>
      <div className="flex flex-wrap gap-2.5 max-lg:flex-col">
        <button
          type="submit"
          className={buttonClassName('primary', 'lg', 'max-lg:w-full max-lg:rounded-pill', {
            shape: 'rect',
            radius: 11,
          })}
        >
          {copy.submit}
          <ArrowRightIcon size={15} />
        </button>
        <ContactLink
          href={mailHref}
          placement="page_cta"
          className={buttonClassName('secondary', 'lg', 'max-lg:w-full')}
        >
          {copy.emailCv}
        </ContactLink>
      </div>
      <p className="text-[12px] leading-[1.55] font-semibold text-text-tertiary xl:text-[11px]">
        {copy.note.lead}{' '}
        <a
          href={portalHref}
          target="_blank"
          rel="noopener"
          className="font-extrabold text-blue-safe underline"
        >
          {copy.note.link}
        </a>
        {copy.note.tail ? ` ${copy.note.tail}` : null}
      </p>
    </form>
  );
}
