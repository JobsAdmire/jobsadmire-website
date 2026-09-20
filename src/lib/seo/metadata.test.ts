import { describe, expect, it } from 'vitest';
import { buildMetadata } from './metadata';
import { absoluteUrl } from './routes';
import { makeT } from '@/content/pure';
import fixture from '../../../contract/website-bundle.v1.fixture.json';
import { BundleSchema } from '../../../contract/website-bundle.v1';

const bundle = BundleSchema.parse(fixture);
const t = makeT(bundle);

const base = {
  locale: 'tr' as const,
  href: '/' as const,
  bundle,
  fallbackTitle: 'JobsAdmire',
  fallbackDescription: 'fallback description',
};

describe('buildMetadata', () => {
  it('takes title, description, canonical and alternates from the page record', () => {
    const md = buildMetadata({ ...base, pageKey: 'home' });
    expect(md.title).toBe(t('home.017'));
    expect(md.description).toBe(t('home.018'));
    expect(md.alternates?.canonical).toBe(absoluteUrl('tr', '/'));
    expect(md.alternates?.languages).toEqual({
      tr: absoluteUrl('tr', '/'),
      en: absoluteUrl('en', '/'),
      'x-default': absoluteUrl('tr', '/'),
    });
    expect(md.robots).toMatchObject({ index: true, follow: true });
  });

  it('honours a noindex page record', () => {
    const noindex = {
      ...bundle,
      pages: { ...bundle.pages, home: { ...bundle.pages.home, robots: 'noindex' as const } },
    };
    const md = buildMetadata({ ...base, bundle: noindex, pageKey: 'home' });
    expect(md.robots).toMatchObject({ index: false, follow: false });
  });

  it('falls back when the bundle carries no record for the page', () => {
    const md = buildMetadata({ ...base, pageKey: 'no-such-page' });
    expect(md.title).toBe('JobsAdmire');
    expect(md.description).toBe('fallback description');
    expect(md.alternates?.canonical).toBe(absoluteUrl('tr', '/'));
    expect(md.robots).toMatchObject({ index: true, follow: true });
  });

  it("uses the fallbacks when the page record's ids are '' (no package SEO string, W23/W38)", () => {
    const blank = {
      ...bundle,
      pages: { ...bundle.pages, home: { ...bundle.pages.home, titleId: '', descriptionId: '' } },
    };
    const md = buildMetadata({ ...base, bundle: blank, pageKey: 'home' });
    expect(md.title).toBe('JobsAdmire');
    expect(md.description).toBe('fallback description');
    expect(md.robots).toMatchObject({ index: true, follow: true });
  });
});
