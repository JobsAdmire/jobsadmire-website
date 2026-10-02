import { describe, expect, it } from 'vitest';
import en from '@/messages/en.json';
import tr from '@/messages/tr.json';

/** Every `sys.*` key this page reads (W9/W23) — the page never reads a key outside this list,
 *  and both locale files carry every key (`messages.test.ts` asserts the two sets are
 *  identical; this pins that the page's own keys exist at all, with the right shape). */
export const STORIES_SYS_KEYS = [
  'seo.stories.title',
  'seo.stories.description',
  'stories.hero.bodyEmpty',
  'stories.hero.liveBadge',
  'stories.wall.intro',
  'stories.wall.legend',
  'stories.wall.showingAll',
  'stories.wall.showingFiltered',
  'stories.empty.title',
  'stories.empty.body',
  'stories.empty.cta',
  'stories.empty.prefill',
  'stories.whatsappPrefill',
  'stories.workers.card1Title',
] as const;

const get = (root: unknown, path: string) =>
  path
    .split('.')
    .reduce<unknown>(
      (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
      root,
    );

describe('sys.stories.* / sys.seo.stories.* (W9, W23)', () => {
  it.each(STORIES_SYS_KEYS)('%s exists in both locales as a non-empty string', (key) => {
    for (const messages of [tr, en]) {
      const v = get(messages.sys, key);
      expect(typeof v).toBe('string');
      expect((v as string).length).toBeGreaterThan(0);
    }
  });
  it('the hero live-badge count is real ICU (LiveBadge is server-rendered, W148 n/a)', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'stories.hero.liveBadge')).toMatch(/\{count, plural,/);
    }
  });
  it('the wall result lines are plain {token} strings, never ICU (the island does not call useTranslations, W148)', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'stories.wall.showingAll')).toContain('{count}');
      expect(get(messages.sys, 'stories.wall.showingAll')).not.toMatch(/\{count, plural,/);
      const filtered = get(messages.sys, 'stories.wall.showingFiltered') as string;
      expect(filtered).toContain('{shown}');
      expect(filtered).toContain('{total}');
    }
  });
  it('the SEO title ends with the brand and says Türkiye, not Turkey (W7)', () => {
    expect(get(en.sys, 'seo.stories.title')).toMatch(/Türkiye.*\| JobsAdmire$/);
    expect(get(tr.sys, 'seo.stories.title')).toMatch(/\| JobsAdmire$/);
    expect(get(en.sys, 'seo.stories.description')).not.toMatch(/\bTurkey\b/);
  });
  it('the empty-wall copy never claims that approvals are shown (delta 7)', () => {
    for (const messages of [tr, en]) {
      expect(get(messages.sys, 'stories.hero.bodyEmpty')).not.toMatch(/Below|Aşağıda/);
      expect(get(messages.sys, 'stories.whatsappPrefill')).not.toMatch(/saw your|gördüm/);
    }
  });
});
