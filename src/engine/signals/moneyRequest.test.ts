import { describe, it, expect } from 'vitest';
import { moneyRequestSignal } from './moneyRequest';

describe('moneyRequestSignal', () => {
  it('detects registration and processing fees', () => {
    const text = 'Pay a registration fee of $50 to begin your remote employment.';
    const matches = moneyRequestSignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects gift cards and crypto requests', () => {
    const text = 'Purchase an Apple gift card or transfer bitcoin to settle your overdue invoice.';
    const matches = moneyRequestSignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('detects customs and clearance charges', () => {
    const text = 'Your parcel is on hold. Pay customs fee to clear delivery.';
    const matches = moneyRequestSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text.toLowerCase()).toBe('customs fee');
  });

  it('detects penalties and fine settlement demands', () => {
    const text = 'Settle your penalty of $500 immediately to avoid arrest.';
    const matches = moneyRequestSignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].text.toLowerCase()).toContain('penalty of $500');
  });

  it('ignores standard non-solicitation text', () => {
    const text = 'Your invoice #4928 was paid in full yesterday. Thank you!';
    const matches = moneyRequestSignal.detect(text);
    expect(matches).toEqual([]);
  });
});
