import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OPENING, opening } from '@/test/careers';
import { listOpenings } from './careers';
import { careersSitemapSource } from './careers-sitemap';

vi.mock('./careers', () => ({ listOpenings: vi.fn() }));

beforeEach(() => vi.mocked(listOpenings).mockReset());

describe('careersSitemapSource (W31)', () => {
  it('one entry per opening in the requested locale, with both hreflang alternates', async () => {
    vi.mocked(listOpenings).mockResolvedValue([OPENING, opening({ slug: 'second-role' })]);
    const tr = await careersSitemapSource('tr');
    expect(tr.map((entry) => entry.url)).toEqual([
      'https://www.jobsadmire.com/kariyer/country-representative-uzbekistan',
      'https://www.jobsadmire.com/kariyer/second-role',
    ]);
    expect(tr[0]).toEqual({
      url: 'https://www.jobsadmire.com/kariyer/country-representative-uzbekistan',
      alternates: {
        languages: {
          tr: 'https://www.jobsadmire.com/kariyer/country-representative-uzbekistan',
          en: 'https://www.jobsadmire.com/en/careers/country-representative-uzbekistan',
          'x-default': 'https://www.jobsadmire.com/kariyer/country-representative-uzbekistan',
        },
      },
      changeFrequency: 'weekly',
      priority: 0.6,
    });
    expect((await careersSitemapSource('en'))[0].url).toBe(
      'https://www.jobsadmire.com/en/careers/country-representative-uzbekistan',
    );
  });

  it('is empty when nothing is open — a door-less build lists no detail page', async () => {
    vi.mocked(listOpenings).mockResolvedValue([]);
    expect(await careersSitemapSource('tr')).toEqual([]);
  });
});
