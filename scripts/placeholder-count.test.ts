/** @vitest-environment node */
import { describe, expect, it } from 'vitest';
import { evaluateScan, formatReadinessTable, scanPlaceholders } from './placeholder-count';

// What a ported page's server HTML looks like (the homepage since W233): the RSC flight payload
// repeats the props inside a <script> (never as tags), a commented-out slot, the hero photo as
// the LCP element (`v4-hero`, with its head preload and an h1 that carries no slot), two named
// placeholders (one an ImageSlot fallback, one self-closing).
const PAGE = `<!DOCTYPE html><html lang="tr"><head>
<link rel="preload" as="image" imagesrcset="/_next/image?url=%2Fhero%2Fhome.jpg&amp;w=640&amp;q=75 640w" imagesizes="100vw"/>
<script>self.__next_f.push([1,"<div data-placeholder=\\"in-flight\\"></div>"])</script>
</head><body>
<!-- <img data-placeholder="in-comment"> -->
<section class="hero">
  <div aria-hidden="true"><img alt="" width="1600" height="900" class="w-full object-cover" src="/_next/image?url=%2Fhero%2Fhome.jpg&amp;w=3840&amp;q=75" data-lcp-slot="v4-hero"/></div>
  <h1 data-testid="page-h1">Türkiye'de çalışacak doğrulanmış işçiler</h1>
</section>
<img src="/brand/ja-mark.png" alt="" data-placeholder='rep-founder'>
<div data-placeholder="portal-shortlist"/>
</body></html>`;

describe('placeholder-count (D26)', () => {
  it('counts data-placeholder and data-lcp-slot on real tags only', () => {
    const scan = scanPlaceholders(PAGE);
    expect(scan.placeholders).toEqual(['rep-founder', 'portal-shortlist']);
    expect(scan.lcpSlots).toEqual(['v4-hero']);
    expect(scan.both).toEqual([]);
  });

  it('passes a page whose LCP slot is real and reports the placeholder count', () => {
    const v = evaluateScan('/', 200, scanPlaceholders(PAGE));
    expect(v).toEqual({
      route: '/',
      status: 200,
      placeholders: ['rep-founder', 'portal-shortlist'],
      lcpSlot: 'v4-hero',
      problems: [],
    });
  });

  it('fails when the LCP slot is itself a placeholder (same element — an ImageSlot without src)', () => {
    const html = `<h1 data-lcp-slot="h1">x</h1><div role="img" data-placeholder="hw-hero" data-lcp-slot="hw-hero"></div>`;
    const v = evaluateScan('/isci-talebi', 200, scanPlaceholders(html));
    expect(v.problems).toContain('LCP slot "hw-hero" is a placeholder (D26)');
    expect(v.problems).toContain('more than one data-lcp-slot: h1, hw-hero');
  });

  it('fails when the LCP slot name is also rendered as a placeholder elsewhere', () => {
    const html = `<div data-placeholder="hw-hero"></div><h1 data-lcp-slot="hw-hero">x</h1>`;
    const v = evaluateScan('/isci-talebi', 200, scanPlaceholders(html));
    expect(v.problems).toEqual(['LCP slot "hw-hero" is a placeholder (D26)']);
  });

  it('reads a bare data-placeholder as unnamed and fails it (W55)', () => {
    const scan = scanPlaceholders(`<div data-placeholder>bare</div><h1 data-lcp-slot="h1">t</h1>`);
    expect(scan.placeholders).toEqual(['']);
    expect(evaluateScan('/x', 200, scan).problems).toEqual(['unnamed data-placeholder (W55)']);
  });

  it('fails when no LCP slot is named or the route did not answer 200', () => {
    expect(evaluateScan('/x', 200, scanPlaceholders('<h1>x</h1>')).problems).toEqual([
      'no data-lcp-slot on the page',
    ]);
    expect(evaluateScan('/x', 404, scanPlaceholders('')).problems).toEqual([
      'HTTP 404',
      'no data-lcp-slot on the page',
    ]);
    expect(evaluateScan('/x', null, scanPlaceholders('')).problems[0]).toBe('no response');
  });

  it('prints the content-readiness table', () => {
    const table = formatReadinessTable([
      evaluateScan('/', 200, scanPlaceholders(PAGE)),
      evaluateScan('/en', 200, scanPlaceholders('<h1 data-lcp-slot="h1">Home</h1>')),
      evaluateScan(
        '/x',
        200,
        scanPlaceholders('<div data-placeholder></div><h1 data-lcp-slot="h1">t</h1>'),
      ),
    ]);
    expect(table).toContain('| / | 200 | 2 | rep-founder, portal-shortlist | v4-hero | ok |');
    expect(table).toContain('| /en | 200 | 0 | — | h1 | ok |');
    expect(table).toContain(
      '| /x | 200 | 1 | (unnamed) | h1 | FAIL: unnamed data-placeholder (W55) |',
    );
  });
});
