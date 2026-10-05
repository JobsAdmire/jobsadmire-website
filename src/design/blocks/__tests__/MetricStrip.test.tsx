import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetricStrip } from '../MetricStrip';
import { NextIntlClientProvider } from 'next-intl';
import tr from '@/messages/tr.json';
import { testBundle } from '@/test/bundle';

// Rows satisfy T0b's `MetricSchema` exactly (`src/content/collections.ts`: every field
// present, `unitId` nullable but never missing) — `getCollection` throws under vitest on a
// schema miss.
const metrics = [
  { key: 'placed', value: 470, text: null, suffix: '+', labelId: 'm.placed', unitId: null },
  // unsigned → hidden (W1)
  { key: 'employers', value: null, text: null, suffix: '+', labelId: 'm.employers', unitId: null },
  { key: 'countries', value: 13, text: null, suffix: '', labelId: 'm.countries', unitId: null },
  {
    key: 'firstDayWeeks',
    value: null,
    text: '6–8',
    suffix: '',
    labelId: 'm.weeks',
    unitId: 'm.wk',
  },
  // no label → hidden
  { key: 'permitDays', value: 45, text: null, suffix: '', labelId: null, unitId: 'm.days' },
];
const bundle = testBundle({
  strings: {
    'm.placed': 'işe yerleştirilen çalışan',
    'm.employers': 'işveren',
    'm.countries': 'ülke',
    'm.weeks': 'ilk iş gününe',
    'm.wk': 'hafta',
    'm.days': 'gün',
  },
  collections: { metrics },
});

describe('MetricStrip', () => {
  it('renders the signed metrics in the requested order and skips the unsigned ones', () => {
    render(
      <MetricStrip
        bundle={bundle}
        locale="tr"
        metrics={['placed', 'employers', 'countries', 'firstDayWeeks', 'permitDays']}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('470+');
    expect(items[0]).toHaveTextContent('işe yerleştirilen çalışan');
    expect(items[2]).toHaveTextContent('6–8 hafta'); // unitId joins the suffix
    expect(screen.queryByText('işveren')).toBeNull();
  });

  // QA W221 H-06 (= about-03): below lg the strip is a two-column grid, so `px-4 first:pl-0
  // last:pr-0` indented the right column and the second row by 16 px on phones. Per column there:
  // the odd items (left) start flush, the even ones keep the 16 px gutter, every item ends flush;
  // the lg row keeps the design's per-item padding.
  it('pads the phone grid per column and the lg row per item (H-06)', () => {
    render(
      <MetricStrip
        bundle={bundle}
        locale="tr"
        metrics={['placed', 'employers', 'countries', 'firstDayWeeks', 'permitDays']}
      />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(1);
    for (const li of items) {
      expect(li).toHaveClass(
        'max-lg:odd:pl-0',
        'max-lg:even:pl-4',
        'max-lg:pr-0',
        'lg:px-4',
        'lg:first:pl-0',
        'lg:last:pr-0',
      );
      expect(li).not.toHaveClass('px-4', 'first:pl-0', 'last:pr-0');
    }
  });

  it('renders nothing when every requested metric is unsigned (the empty wall)', () => {
    const { container } = render(
      <MetricStrip bundle={bundle} locale="tr" metrics={['employers', 'permitDays']} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('dark tone reaches the Stat', () => {
    render(<MetricStrip bundle={bundle} locale="en" metrics={['countries']} tone="dark" />);
    expect(screen.getByText('ülke')).toHaveClass('text-white/55');
  });

  it('pill variant: translucent pills with the figure and label inline, coloured figures (SHARED 12.2)', () => {
    render(
      <MetricStrip bundle={bundle} locale="tr" metrics={['placed', 'countries']} variant="pill" />,
    );
    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveClass('rounded-pill', 'bg-white/[0.08]');
    expect(items[0].firstElementChild).toHaveClass('flex', 'items-baseline');
    expect(items[0].querySelector('p')).toHaveClass('text-sky');
    expect(items[1].querySelector('p')).toHaveClass('text-[#4ade80]');
  });

  it('centered-divided variant appends a static sample cell with the SampleTag (SHARED 12.3)', () => {
    const { container } = render(
      <NextIntlClientProvider locale="tr" messages={tr}>
        <MetricStrip
          bundle={bundle}
          locale="tr"
          metrics={['placed']}
          variant="centered-divided"
          extra={[{ figure: '%98', label: 'Müşteri bağlılığı', sample: true }]}
        />
      </NextIntlClientProvider>,
    );
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveClass('text-center');
    expect(items[1]).toHaveTextContent('%98');
    expect(container.querySelector('[data-sample-tag]')).not.toBeNull();
  });

  it('hero variant folds the third cell inline and hides a fourth at ≤ 460 (SHARED 12.1)', () => {
    render(
      <MetricStrip
        bundle={bundle}
        locale="tr"
        metrics={['placed', 'countries', 'firstDayWeeks']}
        tone="dark"
        variant="hero"
      />,
    );
    const third = screen.getAllByRole('listitem')[2];
    expect(third).toHaveClass('max-xs:col-span-2');
    expect(third.firstElementChild).toHaveClass('max-xs:flex', 'max-xs:items-baseline');
  });
});
