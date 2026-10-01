'use client';
import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/analytics/track';
import type { Locale } from '@/i18n/routing';
import { stateKey, type TeaserView } from '../lib/teaser-keys';
import { LiveDot } from './LiveDot';
import { TEASER_WA_CLASS, TeaserCard, type TeaserCardCopy } from './TeaserCard';
import { TeaserChips } from './TeaserChips';
import { TeaserLayout } from './TeaserLayout';
import { WhatsAppComposeLink } from './WhatsAppComposeLink';

export type CalculatorTeaserProps = {
  locale: Locale;
  /** every (preset × chip) state, computed on the server by the one engine (W2) */
  views: Record<string, TeaserView>;
  roles: { key: string; label: string }[];
  headcounts: { value: number; label: string }[];
  initialRole: string;
  initialHeadcount: number;
  whatsappNumber: string;
  legends: { roles: string; headcount: string };
  copy: TeaserCardCopy;
  leftTop: ReactNode;
  leftBottom: ReactNode;
  ctas: ReactNode;
};

/**
 * The interactive teaser: two chip rows switching between precomputed views, the ≤ 460 px
 * breakdown disclosure, the click-time estimate link. Its first render equals the server
 * fallback (same components, same default view), so the LazyIsland swap never shifts layout.
 */
export function CalculatorTeaser(props: CalculatorTeaserProps) {
  const { locale, views, roles, headcounts, whatsappNumber, legends, copy } = props;
  // R35: the real URL, not next-intl's internal key.
  const page = usePathname() ?? '/';
  const [role, setRole] = useState(props.initialRole);
  const [headcount, setHeadcount] = useState(props.initialHeadcount);
  const [expanded, setExpanded] = useState(false);
  const view =
    views[stateKey(role, headcount)] ?? views[stateKey(props.initialRole, props.initialHeadcount)];
  // W12: enum-like params only — the preset row key and the chip's number, never free text.
  const fire = (nextRole: string, nextHeadcount: number) =>
    track('calculator_use', { page, locale, role: nextRole, headcount: nextHeadcount });
  return (
    <TeaserLayout
      ready
      leftTop={props.leftTop}
      leftBottom={props.leftBottom}
      chips={
        <>
          <TeaserChips
            name="teaser-role"
            legend={legends.roles}
            options={roles.map((r) => ({ value: r.key, label: r.label }))}
            value={role}
            spanLast
            onChange={(next) => {
              setRole(next);
              fire(next, headcount);
            }}
          />
          <TeaserChips
            name="teaser-headcount"
            legend={legends.headcount}
            emphasis="ink"
            options={headcounts.map((h) => ({ value: String(h.value), label: h.label }))}
            value={String(headcount)}
            onChange={(next) => {
              const n = Number(next);
              setHeadcount(n);
              fire(role, n);
            }}
          />
        </>
      }
      card={
        <TeaserCard
          view={view}
          copy={copy}
          expanded={expanded}
          onToggle={() => setExpanded((open) => !open)}
          ctas={props.ctas}
          whatsapp={
            <WhatsAppComposeLink
              number={whatsappNumber}
              text={view.whatsappText}
              className={TEASER_WA_CLASS}
            >
              <LiveDot />
              {copy.whatsapp}
            </WhatsAppComposeLink>
          }
        />
      }
    />
  );
}
