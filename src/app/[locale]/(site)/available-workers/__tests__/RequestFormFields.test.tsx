import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FormErrorsContext } from '@/forms/client/FormErrorsContext';
import { PoolExplorer } from '../_components/PoolExplorer';
import { RequestCard } from '../_components/RequestCard';
import { RequestFormFields, type RequestFormFieldsProps } from '../_components/RequestFormFields';
import { COPY, renderInPool, ROWS } from './pool-fixture';

const props: RequestFormFieldsProps = {
  roles: {
    direct_employer: {
      tab: 'Employer',
      companyLabel: 'Company name',
      tradeLabel: 'Which roles?',
    },
    hr_agency: {
      tab: 'HR agency',
      companyLabel: 'Agency name',
      tradeLabel: 'Which roles do your clients need?',
    },
  },
  labels: {
    name: 'Contact person',
    email: 'Email',
    phone: 'Phone / WhatsApp',
    city: 'City in Türkiye',
  },
  basket: { one: 'profile attached', many: 'profiles attached', clear: 'Clear' },
};
const HEAD = {
  direct_employer: { title: 'Request these candidates', subtitle: 'Full CVs within 4 hours.' },
  hr_agency: { title: 'Supply for your clients', subtitle: 'Your client stays yours.' },
};
const CTA = {
  ready: '7 ready now',
  reply: 'Reply in 4 h',
  noFee: 'No upfront fee',
  start: 'Start my request',
  browse: 'Browse the pool',
};
const hidden = (c: HTMLElement, name: string) =>
  c.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`);

describe('RequestFormFields (design ll. 522–571)', () => {
  it('asks only the catalog-required fields, placeholder-only in the design’s three pairs (W77/W115)', () => {
    const { container } = renderInPool(<RequestFormFields {...props} />);
    for (const name of ['company', 'name', 'email', 'phone', 'city', 'trade'])
      expect(container.querySelector(`[name="${name}"]`), name).not.toBeNull();
    // the optional fields the design does not draw are gone; never a sector select (W77/W78)
    for (const name of ['headcount', 'startWhen', 'message', 'sector'])
      expect(container.querySelector(`[name="${name}"]`), name).toBeNull();
    // visually hidden labels whose words are the placeholders (SHARED 4.1)
    expect(screen.getByLabelText(/^Company name/)).toHaveAttribute('placeholder', 'Company name');
    expect(screen.getByLabelText(/^Contact person/)).toHaveAttribute('name', 'name');
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^Phone \/ WhatsApp/)).toHaveAttribute('type', 'tel');
    expect(screen.getByLabelText(/^City in Türkiye/)).toHaveAttribute('name', 'city');
    expect(screen.getByLabelText(/^Which roles\?/)).toHaveAttribute('name', 'trade');
    expect(container.querySelector('[name="trade"]')).toHaveAttribute('maxlength', '200');
    expect(container.querySelector('[name="city"]')).toHaveAttribute('maxlength', '120');
  });

  it('the role is two underline tabs posting the hidden catalog field iAm — employer by default', () => {
    const { container } = renderInPool(<RequestFormFields {...props} />);
    const list = screen.getByRole('tablist');
    expect(list).toHaveAttribute('data-variant', 'underline');
    expect(screen.getByRole('tab', { name: 'Employer' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'HR agency' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
    expect(container.querySelectorAll('[name="iAm"]')).toHaveLength(1);
    expect(hidden(container, 'iAm')).toHaveValue('direct_employer');
    expect(hidden(container, 'profileRefs')).toHaveValue('');
  });

  it('switching the tab swaps the company and roles labels, posts hr_agency and carries what was typed', async () => {
    const user = userEvent.setup();
    const { container } = renderInPool(<RequestFormFields {...props} />);
    await user.type(screen.getByLabelText(/^Company name/), 'Akdeniz');
    await user.type(screen.getByLabelText(/^Email/), 'a@b.co');
    await user.click(screen.getByRole('tab', { name: 'HR agency' }));
    expect(screen.getByRole('tab', { name: 'HR agency' })).toHaveAttribute('aria-selected', 'true');
    expect(hidden(container, 'iAm')).toHaveValue('hr_agency');
    expect(screen.getByLabelText(/^Agency name/)).toHaveValue('Akdeniz');
    expect(screen.getByLabelText(/^Email/)).toHaveValue('a@b.co');
    expect(screen.getByLabelText(/^Which roles do your clients need/)).toHaveAttribute(
      'name',
      'trade',
    );
    // one set of fields only — the hidden tab's panel is empty
    expect(container.querySelectorAll('[name="company"]')).toHaveLength(1);
  });

  it('a failed submit echoes the chosen role back (useFieldValue)', () => {
    const { container } = renderInPool(
      <FormErrorsContext.Provider value={{ errors: {}, values: { iAm: 'hr_agency' } }}>
        <RequestFormFields {...props} />
      </FormErrorsContext.Provider>,
    );
    expect(hidden(container, 'iAm')).toHaveValue('hr_agency');
    expect(screen.getByRole('tab', { name: 'HR agency' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByLabelText(/^Agency name/)).toHaveAttribute('name', 'company');
  });

  it('a card’s "Add to request" fills the basket box and the hidden profileRefs; chips remove, Clear empties', async () => {
    const user = userEvent.setup();
    const avatars = Object.fromEntries(ROWS.map((w) => [w.ref, null]));
    const { container } = renderInPool(
      <>
        <RequestFormFields {...props} />
        <PoolExplorer rows={ROWS} avatars={avatars} copy={COPY} waHire="https://wa.me/1" />
      </>,
    );
    expect(screen.queryByTestId('workers-basket')).toBeNull();
    const adds = screen.getAllByRole('button', { name: new RegExp(COPY.add) });
    await user.click(adds[0]); // JA-1058, the soonest available
    await user.click(adds[1]); // JA-1094
    const box = screen.getByTestId('workers-basket');
    expect(box).toHaveTextContent('2 profiles attached');
    expect(hidden(container, 'profileRefs')).toHaveValue('JA-1058, JA-1094');
    await user.click(within(box).getByRole('button', { name: /JA-1058/ }));
    expect(box).toHaveTextContent('1 profile attached');
    expect(hidden(container, 'profileRefs')).toHaveValue('JA-1094');
    await user.click(within(box).getByRole('button', { name: 'Clear' }));
    expect(screen.queryByTestId('workers-basket')).toBeNull();
    expect(hidden(container, 'profileRefs')).toHaveValue('');
  });
});

describe('RequestCard (design #pool-form, ll. 506–578)', () => {
  it('the head band follows the role tab; the phone CTA opens the form body', async () => {
    const user = userEvent.setup();
    renderInPool(
      <RequestCard head={HEAD} cta={CTA}>
        <RequestFormFields {...props} />
      </RequestCard>,
    );
    const head = screen.getByTestId('workers-form-head');
    expect(
      within(head).getByRole('heading', { level: 2, name: 'Request these candidates' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: 'HR agency' }));
    expect(
      within(head).getByRole('heading', { level: 2, name: 'Supply for your clients' }),
    ).toBeInTheDocument();
    // ≤ 700 px the body is collapsed behind the CTA (CSS), which opens it
    const body = document.getElementById('pool-form-body') as HTMLElement;
    expect(body).toHaveClass('max-md:hidden');
    const cta = screen.getByTestId('workers-form-cta');
    expect(cta).toHaveTextContent('7 ready now');
    expect(within(cta).getByRole('link', { name: 'Browse the pool' })).toHaveAttribute(
      'href',
      '#pool',
    );
    await user.click(within(cta).getByRole('button', { name: 'Start my request' }));
    expect(screen.queryByTestId('workers-form-cta')).toBeNull();
    expect(body).not.toHaveClass('max-md:hidden');
  });

  it('adding a profile opens the card on phones and rings it green for a moment', async () => {
    const user = userEvent.setup();
    const avatars = Object.fromEntries(ROWS.map((w) => [w.ref, null]));
    renderInPool(
      <>
        <RequestCard head={HEAD} cta={CTA}>
          <RequestFormFields {...props} />
        </RequestCard>
        <PoolExplorer rows={ROWS} avatars={avatars} copy={COPY} waHire="https://wa.me/1" />
      </>,
    );
    const card = document.getElementById('pool-form') as HTMLElement;
    expect(card).not.toHaveAttribute('data-open');
    await user.click(screen.getAllByRole('button', { name: new RegExp(COPY.add) })[0]);
    expect(card).toHaveAttribute('data-open', 'true');
    expect(card).toHaveClass('border-success');
    expect(screen.queryByTestId('workers-form-cta')).toBeNull();
  });
});
