import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetricStrip } from '../MetricStrip';
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
});
