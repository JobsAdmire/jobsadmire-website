import type { Locale } from '@/i18n/routing';
import {
  countryNameOf,
  descriptionBlocks,
  detailHref,
  ENGAGEMENT_OF,
  isNewOpening,
  locationOf,
  placeOf,
  summaryOf,
  workModesOf,
  type Engagement,
  type Place,
  type PublicOpening,
  type WorkMode,
} from '@/lib/careers-pure';
import { waLink } from '@/lib/contact';
import { formatDate } from '@/lib/format/date/formatDate';

/** A package-id accessor: `makeTf(bundle, locale)` (D17 placeholders filled). */
export type Tf = (id: string) => string;

/** One list of the role's open panel (design `r.duties` / `r.wants`, ll. 745–770): the API has
 *  no duties/wants split, so the panel shows the description's own first lists under their own
 *  lead-in line ("The work:", "The profile:") — data, never the package's `jt.050`/`jt.051`. */
export type RolePanelList = { heading: string; items: string[] };

/** One role as the `RolesList` island and the hero card receive it: plain strings and typed
 *  hrefs, already resolved — no bundle, no `Date`, no function crosses to the client. */
export type RoleCard = {
  slug: string;
  title: string;
  summary: string;
  /** up to two lists for the open panel; empty → the panel shows `summary` */
  panel: RolePanelList[];
  location: string;
  workModes: string;
  place: Place;
  engagement: Engagement;
  engagementLabel: string;
  isNew: boolean;
  posted: string;
  href: ReturnType<typeof detailHref>;
  applyHref: ReturnType<typeof detailHref> & { hash: '#apply' };
  askHref: string;
};

export type RoleCopy = {
  /** `jt.099` Full-time · `jt.100` Part-time · `jt.073` Project-based */
  engagement: Record<Engagement, string>;
  /** `sys.careers.workMode.*` */
  workMode: Record<WorkMode, string>;
  /** `sys.careers.roles.posted` around the formatted date */
  posted: (date: string) => string;
  /** `jt.311` */
  askIntro: string;
  /** `jt.312` */
  askTail: string;
};

/** "Ask a question first" on WhatsApp: `jt.311` + title + `jt.312` + location + ")" — the
 *  package's own split sentence (W23). It carries page data only, never anything a visitor
 *  typed (W76/W95), so it may sit in a DOM href. */
export const askHrefOf = (
  whatsappNumber: string,
  copy: Pick<RoleCopy, 'askIntro' | 'askTail'>,
  title: string,
  location: string,
) => waLink(whatsappNumber, `${copy.askIntro} ${title} ${copy.askTail}${location})`);

/** A short line ending in a colon (or a heading) right before a list is that list's lead-in. */
const LEAD_IN = /[:：]\s*$/u;

/** The open panel's lists (parity S4.3): the description's first `max` lists, `maxItems`
 *  items each, each under the heading or colon-ended line that introduces it (else none). */
export function panelListsOf(description: string | null, max = 2, maxItems = 5): RolePanelList[] {
  const blocks = descriptionBlocks(description);
  const out: RolePanelList[] = [];
  blocks.forEach((block, i) => {
    if (out.length >= max || (block.type !== 'ul' && block.type !== 'ol')) return;
    const prev = blocks[i - 1];
    const lead =
      prev && (prev.type === 'h' || (prev.type === 'p' && LEAD_IN.test(prev.text)))
        ? prev.text.replace(LEAD_IN, '').trim()
        : '';
    out.push({ heading: lead.length <= 80 ? lead : '', items: block.items.slice(0, maxItems) });
  });
  return out;
}

export function roleCards(
  openings: readonly PublicOpening[],
  ctx: {
    locale: Locale;
    countries: ReadonlyArray<{ code: string; name: string }>;
    copy: RoleCopy;
    whatsappNumber: string;
    now: Date;
  },
): RoleCard[] {
  return openings.map((o) => {
    const location = locationOf(o, countryNameOf(o.country, ctx.countries, ctx.locale));
    const engagement = ENGAGEMENT_OF[o.category];
    return {
      slug: o.slug,
      title: o.title,
      summary: summaryOf(o.description),
      panel: panelListsOf(o.description),
      location,
      workModes: workModesOf(o)
        .map((mode) => ctx.copy.workMode[mode])
        .join(' · '),
      place: placeOf(o),
      engagement,
      engagementLabel: ctx.copy.engagement[engagement],
      isNew: isNewOpening(o.postedAt, ctx.now),
      posted: ctx.copy.posted(formatDate(o.postedAt, ctx.locale)),
      href: detailHref(o.slug),
      applyHref: { ...detailHref(o.slug), hash: '#apply' },
      askHref: askHrefOf(ctx.whatsappNumber, ctx.copy, o.title, location),
    };
  });
}

/** The hero card (design `heroRoles`): the first four overseas roles, in the API's order. */
export const heroRoles = (cards: readonly RoleCard[]): RoleCard[] =>
  cards.filter((c) => c.place === 'overseas').slice(0, 4);
