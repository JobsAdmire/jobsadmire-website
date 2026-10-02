import type { Locale } from '@/i18n/routing';
import {
  countryNameOf,
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

/** One role as the `RolesList` island and the hero card receive it: plain strings and typed
 *  hrefs, already resolved — no bundle, no `Date`, no function crosses to the client. */
export type RoleCard = {
  slug: string;
  title: string;
  summary: string;
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
