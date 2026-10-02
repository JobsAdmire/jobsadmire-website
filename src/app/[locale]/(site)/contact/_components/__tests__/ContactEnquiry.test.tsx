import { fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FormActionState } from '@/forms/types';
import en from '@/messages/en.json';
import { renderWithIntl } from '@/test/render';
import { ContactEnquiry, type ContactEnquiryCopy } from '../ContactEnquiry';

const idle = vi.fn(async (): Promise<FormActionState> => ({ status: 'idle' }));

const copy: ContactEnquiryCopy = {
  legend: 'What is this about?',
  topics: {
    hire: { label: 'I need workers', sub: 'Roles, headcount and a quote' },
    permit: { label: 'Work permit only', sub: 'You already have the worker' },
    partner: { label: 'Agency or agent', sub: 'Supply or partner with us' },
    job: { label: 'I am looking for a job', sub: 'Candidates start here' },
  },
  forms: {
    hire: {
      title: 'Tell us the roles',
      sub: 'Job titles and headcount are enough to start.',
      desk: 'employer desk',
      companyLabel: 'Company name',
      companyPlaceholder: 'Registered company name',
      subjectLabel: 'Roles and headcount',
      subjectPlaceholder: 'e.g. 10 welders',
      extraLabel: 'City in Türkiye',
      submit: 'Send my hiring request',
    },
    permit: {
      title: 'Permit file, no sourcing',
      sub: 'You already have the worker.',
      desk: 'permit team',
      companyLabel: 'Company name',
      companyPlaceholder: 'Registered company name',
      subjectLabel: 'Worker and role',
      subjectPlaceholder: 'e.g. 1 Uzbek chef',
      extraLabel: 'Workplace city',
      submit: 'Ask the permit team',
    },
    partner: {
      title: 'Supply or partner with us',
      sub: 'Tell us what you bring.',
      desk: 'partnerships desk',
      companyLabel: 'Agency name & country',
      companyPlaceholder: 'e.g. Skyline Manpower, Nepal',
      subjectLabel: 'What you supply',
      subjectPlaceholder: 'e.g. welders and masons',
      extraLabel: 'Licence no.',
      extraPlaceholder: 'If you have one',
      submit: 'Send partnership enquiry',
    },
  },
  deskPrefix: 'Goes to the',
  nameLabel: 'Your name',
  namePlaceholder: 'Who we should ask for',
  emailLabel: 'Email',
  phoneLabel: 'Phone / WhatsApp',
  notesLabel: 'Anything else (optional)',
  notesPlaceholder: 'Start date, shift pattern, accommodation, budget',
  replyLegend: 'Reply me on',
  reply: { whatsapp: 'WhatsApp', email: 'Email', call: 'A call' },
  moreOpen: '+ Add extra details (optional)',
  moreClose: 'Hide extra details',
  fallbackIntro: 'Hello JobsAdmire, the contact form did not go through. My enquiry:',
};

const renderEnquiry = () =>
  renderWithIntl(
    <ContactEnquiry
      action={idle}
      copy={copy}
      locale="en"
      turnstileSiteKey={null}
      whatsappNumber="905011240340"
      contact={{ phone: '+905011240340', email: 'info@jobsadmire.com' }}
      jobPanel={<p>B2B explainer</p>}
      footer={<a href="mailto:info@jobsadmire.com">Rather email? →</a>}
    />,
    { locale: 'en' },
  );

beforeEach(() => {
  window.dataLayer = [];
});

describe('ContactEnquiry', () => {
  it('hire by default: a contact form whose inputs carry the catalog names and the package labels (W114/W115)', () => {
    renderEnquiry();
    const form = screen.getByTestId('contact-enquiry-form');
    expect(form).toHaveAttribute('data-form-key', 'contact');
    expect(form.querySelector('input[name="topic"]')).toHaveValue('hire');
    expect(
      within(form).getByRole('heading', { level: 3, name: 'Tell us the roles' }),
    ).toBeInTheDocument();
    expect(within(form).getByRole('textbox', { name: /^Company name/ })).toHaveAttribute(
      'name',
      'company',
    );
    expect(within(form).getByRole('textbox', { name: /^Your name/ })).toHaveAttribute(
      'id',
      'f-contact-enquiry-name',
    );
    expect(within(form).getByRole('textbox', { name: /^Roles and headcount/ })).toHaveAttribute(
      'name',
      'subject',
    );
    const city = within(form).getByRole('textbox', { name: /^City in Türkiye/ });
    expect(city).toHaveAttribute('name', 'city');
    expect(city).toHaveAttribute('placeholder', en.sys.form.placeholders.city);
    expect(form.querySelector('input[name="licence"]')).toBeNull();
    expect(within(form).getByText(/Goes to the employer desk/)).toBeInTheDocument();
    const reply = within(form).getAllByRole('radio') as HTMLInputElement[];
    expect(reply.map((r) => r.value)).toEqual(['whatsapp', 'email', 'call']);
    expect(reply[0].checked).toBe(true);
    // W79: one consent checkbox, scoped id.
    expect(within(form).getByRole('checkbox')).toHaveAttribute('id', 'f-contact-enquiry-consent');
    expect(within(form).getByRole('button', { name: 'Send my hiring request' })).toHaveAttribute(
      'type',
      'submit',
    );
    // The "Rather email?" line sits under the card, outside the <form>.
    expect(form.contains(screen.getByRole('link', { name: 'Rather email? →' }))).toBe(false);
    expect(window.dataLayer).toEqual([]);
  });

  it('partner swaps city for the licence input and fires contact_topic with the key only (W12/W67)', () => {
    renderEnquiry();
    fireEvent.click(screen.getByRole('radio', { name: /Agency or agent/ }));
    const form = screen.getByTestId('contact-enquiry-form');
    expect(form.querySelector('input[name="topic"]')).toHaveValue('partner');
    const licence = within(form).getByRole('textbox', { name: /^Licence no\./ });
    expect(licence).toHaveAttribute('name', 'licence');
    expect(licence).toHaveAttribute('placeholder', 'If you have one');
    expect(form.querySelector('input[name="city"]')).toBeNull();
    expect(
      within(form).getByRole('button', { name: 'Send partnership enquiry' }),
    ).toBeInTheDocument();
    expect(window.dataLayer).toHaveLength(1);
    expect(window.dataLayer?.[0]).toMatchObject({
      event: 'contact_topic',
      locale: 'en',
      topic: 'partner',
    });
    expect(Object.keys(window.dataLayer?.[0] ?? {}).sort()).toEqual([
      'event',
      'locale',
      'page',
      'topic',
    ]);
  });

  it('switching between filing topics keeps what the visitor typed', () => {
    renderEnquiry();
    fireEvent.change(screen.getByRole('textbox', { name: /^Company name/ }), {
      target: { value: 'Akdeniz Otel' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /Work permit only/ }));
    expect(screen.getByRole('textbox', { name: /^Company name/ })).toHaveValue('Akdeniz Otel');
    expect(screen.getByRole('textbox', { name: /^Worker and role/ })).toHaveAttribute(
      'name',
      'subject',
    );
  });

  it('the job card hides the form and shows the explainer — nothing can be filed (W3)', () => {
    renderEnquiry();
    fireEvent.click(screen.getByRole('radio', { name: /I am looking for a job/ }));
    expect(screen.queryByTestId('contact-enquiry-form')).toBeNull();
    expect(screen.getByTestId('contact-jobseeker')).toHaveTextContent('B2B explainer');
    expect(window.dataLayer?.[0]).toMatchObject({ event: 'contact_topic', topic: 'job' });
  });

  it('the ≤ 700 px "+ Add extra details" toggle controls the two optional wrappers', () => {
    renderEnquiry();
    const toggle = screen.getByRole('button', { name: '+ Add extra details (optional)' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    const ids = (toggle.getAttribute('aria-controls') ?? '').split(' ');
    expect(ids).toHaveLength(2);
    for (const id of ids) expect(document.getElementById(id)).not.toBeNull();
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: 'Hide extra details' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});
