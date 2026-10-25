import { describe, it, expect } from 'vitest';
import { tooGoodToBeTrueSignal } from './tooGoodToBeTrue';

describe('tooGoodToBeTrueSignal', () => {
  it('detects lottery and prize claims', () => {
    const text = 'Congratulations! You have won $1,000,000 in our international lucky draw.';
    const matches = tooGoodToBeTrueSignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects unrealistic work from home offers', () => {
    const text = 'Work from home with no experience needed and earn $500 per day tapping likes.';
    const matches = tooGoodToBeTrueSignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('detects guaranteed return promises', () => {
    const text = 'Invest in our algorithm today and double your money with guaranteed profit.';
    const matches = tooGoodToBeTrueSignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('ignores standard non-promotional text', () => {
    const text = 'Let us schedule our quarterly team planning sync on Friday.';
    const matches = tooGoodToBeTrueSignal.detect(text);
    expect(matches).toEqual([]);
  });
});
