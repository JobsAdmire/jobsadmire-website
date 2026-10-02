// The text of one live-status pill (pure — the island feeds it the minute clock). The labels arrive
// resolved from the server: the package's own split fragments (contact.152–155, 215, 216) and the
// raw `sys.contact.status.*` templates, whose only syntax is `{time}` `{open}` `{close}` `{day}`
// (copy.test.ts pins that), so `fillTemplate` is all the formatting they need and no client module
// has to read `sys.contact` — CLIENT_SYS stays as it is (W148).
import { weekdayName, type OfficeHours, type OfficeStatus } from './office-status';

export type HeroStatusLabels = {
  /** contact.152 "Office open now ·" */ openNow: string;
  /** contact.153 "in Antalya" */ inCity: string;
  /** contact.154 */ weekend: string;
  /** contact.155 */ closedToday: string;
  /** sys.contact.status.opensAt — "Opens {open}" */ opensAt: string;
};
export type WhatsappStatusLabels = { watched: string; off: string };
export type LinesStatusLabels = { open: string; closed: string };
export type OfficeStatusLabels = {
  openNow: string;
  closedOpensAt: string;
  closedOpensTomorrow: string;
  closedOpensOn: string;
};

export type LiveStatusSpec =
  | { variant: 'hero'; labels: HeroStatusLabels }
  | { variant: 'whatsapp'; labels: WhatsappStatusLabels }
  | { variant: 'lines'; labels: LinesStatusLabels }
  | { variant: 'office'; labels: OfficeStatusLabels };

/** `{name}` substitution; an unknown argument stays visible (a copy defect shows, never throws). */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) => values[key] ?? token);
}

export function liveStatusText(
  spec: LiveStatusSpec,
  status: OfficeStatus,
  hours: OfficeHours,
  locale: string,
): string {
  switch (spec.variant) {
    case 'hero': {
      const l = spec.labels;
      if (status.open) return `${l.openNow} ${status.clock} ${l.inCity}`;
      if (status.reason === 'closedDay') return l.weekend;
      if (status.reason === 'beforeOpen')
        return `${fillTemplate(l.opensAt, { open: hours.open })} · ${status.clock} ${l.inCity}`;
      return `${l.closedToday} · ${status.clock} ${l.inCity}`;
    }
    case 'whatsapp':
      return status.open ? spec.labels.watched : spec.labels.off;
    case 'lines':
      return status.open ? spec.labels.open : spec.labels.closed;
    case 'office': {
      const l = spec.labels;
      if (status.open) return fillTemplate(l.openNow, { time: status.clock, close: hours.close });
      if (status.reason === 'beforeOpen')
        return fillTemplate(l.closedOpensAt, { open: hours.open, time: status.clock });
      if (status.opensTomorrow) return fillTemplate(l.closedOpensTomorrow, { open: hours.open });
      return fillTemplate(l.closedOpensOn, {
        day: weekdayName(status.nextOpenDay, locale),
        open: hours.open,
      });
    }
  }
}
