import { describe, expect, it } from 'vitest';
import { shouldShowHint } from '../LanguageHint';

describe('shouldShowHint', () => {
  it('shows once for English browsers on Turkish pages, never after dismissal', () => {
    expect(shouldShowHint('tr', ['en-US', 'en'], null)).toBe(true);
    expect(shouldShowHint('tr', ['tr-TR'], null)).toBe(false);
    expect(shouldShowHint('en', ['en-US'], null)).toBe(false);
    expect(shouldShowHint('tr', ['en-US'], 'off')).toBe(false);
  });

  it('matches the language subtag case-insensitively and ignores later preferences', () => {
    expect(shouldShowHint('tr', ['EN-GB'], null)).toBe(true);
    expect(shouldShowHint('tr', ['de-DE', 'en'], null)).toBe(true);
    expect(shouldShowHint('tr', [], null)).toBe(false);
  });
});
