import { describe, expect, it } from 'vitest';
import { parseLegalBody, parseRuns } from './body';

describe('parseRuns', () => {
  it('splits a **bold** lead from plain text', () => {
    expect(parseRuns('**Address:** in the footer')).toEqual([
      { text: 'Address:', strong: true },
      { text: ' in the footer', strong: false },
    ]);
  });

  it('keeps bold runs in the middle and at the end', () => {
    expect(parseRuns('a **b** c **d**')).toEqual([
      { text: 'a ', strong: false },
      { text: 'b', strong: true },
      { text: ' c ', strong: false },
      { text: 'd', strong: true },
    ]);
  });

  it('returns one plain run without markers, and leaves an unpaired marker as text', () => {
    expect(parseRuns('plain')).toEqual([{ text: 'plain', strong: false }]);
    expect(parseRuns('a ** b')).toEqual([{ text: 'a ** b', strong: false }]);
  });
});

describe('parseLegalBody', () => {
  it('turns blank-line separated blocks into paragraphs and "- " blocks into lists', () => {
    expect(parseLegalBody('Intro line.\n\n- **A:** one\n- two\n\nOutro.')).toEqual([
      { type: 'p', runs: [{ text: 'Intro line.', strong: false }] },
      {
        type: 'ul',
        items: [
          [
            { text: 'A:', strong: true },
            { text: ' one', strong: false },
          ],
          [{ text: 'two', strong: false }],
        ],
      },
      { type: 'p', runs: [{ text: 'Outro.', strong: false }] },
    ]);
  });

  it('joins wrapped lines inside one paragraph and ignores stray whitespace', () => {
    expect(parseLegalBody('  a\nb  \n\n\n c ')).toEqual([
      { type: 'p', runs: [{ text: 'a b', strong: false }] },
      { type: 'p', runs: [{ text: 'c', strong: false }] },
    ]);
  });

  it('returns [] for an empty body', () => {
    expect(parseLegalBody('')).toEqual([]);
  });

  it('never produces markup — angle brackets stay text', () => {
    expect(parseLegalBody('<b>x</b>')).toEqual([
      { type: 'p', runs: [{ text: '<b>x</b>', strong: false }] },
    ]);
  });
});
