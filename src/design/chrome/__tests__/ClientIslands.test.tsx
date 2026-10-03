import { act, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ClientIslands } from '../ClientIslands';
import { HINT_KEY } from '../hint-eligibility';
import { memoryStorage } from '@/test/storage';

// W148: the language hint decides BEFORE it loads. `next/dynamic` requests a component's chunk
// when the component first renders, so this stand-in keeps exactly that contract — the loader
// runs on first render, never at definition — and counts the requests. The hint module itself is
// mocked: what is under test is whether ClientIslands asks for it at all.
const dynamicImports = vi.hoisted(() => ({ requested: 0, loaded: [] as string[] }));

vi.mock('next/dynamic', async () => {
  const { createElement, useEffect, useState } = await import('react');
  type Loaded = (props: Record<string, unknown>) => ReactNode;
  return {
    default: (loader: () => Promise<Loaded>) =>
      function DynamicStandIn(props: Record<string, unknown>) {
        const [Component, setComponent] = useState<Loaded | null>(null);
        useEffect(() => {
          let live = true;
          dynamicImports.requested += 1;
          void loader().then((c) => {
            dynamicImports.loaded.push(c.name);
            if (live) setComponent(() => c);
          });
          return () => {
            live = false;
          };
        }, []);
        return Component ? createElement(Component, props) : null;
      },
  };
});

vi.mock('../LanguageHint', () => ({
  LanguageHint: function LanguageHint() {
    return <div data-testid="language-hint" />;
  },
}));

function browserLanguages(languages: string[]) {
  Object.defineProperty(window.navigator, 'languages', {
    configurable: true,
    get: () => languages,
  });
}

beforeEach(() => {
  dynamicImports.requested = 0;
  dynamicImports.loaded = [];
  vi.stubGlobal('localStorage', memoryStorage());
});

afterEach(() => {
  // back to jsdom's own getter on Navigator.prototype
  delete (window.navigator as { languages?: unknown }).languages;
  vi.unstubAllGlobals();
});

/** Render, then let every effect and resolved import settle. */
async function mount(locale: 'tr' | 'en') {
  render(<ClientIslands consent={false} locale={locale} />);
  await act(async () => {
    await Promise.resolve();
  });
}

describe('ClientIslands requests LanguageHint only for an eligible visitor (W148)', () => {
  it('a Turkish page in a Turkish browser never requests the hint', async () => {
    browserLanguages(['tr-TR', 'tr']);
    await mount('tr');
    expect(dynamicImports.requested).toBe(0);
    expect(screen.queryByTestId('language-hint')).toBeNull();
  });

  it('an English page never requests it, whatever the browser speaks', async () => {
    browserLanguages(['en-US', 'en']);
    await mount('en');
    expect(dynamicImports.requested).toBe(0);
  });

  it('a dismissed hint is never requested again', async () => {
    browserLanguages(['en-GB']);
    localStorage.setItem(HINT_KEY, 'off');
    await mount('tr');
    expect(dynamicImports.requested).toBe(0);
  });

  it('a Turkish page in an English browser requests it once, and it renders', async () => {
    browserLanguages(['en-US', 'en']);
    await mount('tr');
    expect(dynamicImports.requested).toBe(1);
    expect(dynamicImports.loaded).toEqual(['LanguageHint']);
    expect(screen.getByTestId('language-hint')).toBeInTheDocument();
  });
});
