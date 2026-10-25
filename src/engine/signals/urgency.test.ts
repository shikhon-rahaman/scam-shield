import { describe, it, expect } from 'vitest';
import { urgencySignal } from './urgency';

describe('urgencySignal', () => {
  it('detects "immediately"', () => {
    const text = 'Please verify your credentials immediately to avoid disruption.';
    const matches = urgencySignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].text.toLowerCase()).toBe('immediately');
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects "within 24 hours"', () => {
    const text = 'Update details within 24 hours or your access is revoked.';
    const matches = urgencySignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text.toLowerCase()).toBe('within 24 hours');
  });

  it('detects "last warning" and "final notice"', () => {
    const text = 'This is your last warning! Final notice regarding your billing.';
    const matches = urgencySignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('returns empty array when text has no urgency language', () => {
    const text = 'Hi Mom, having dinner with Sarah tomorrow evening at 7.';
    const matches = urgencySignal.detect(text);
    expect(matches).toEqual([]);
  });
});
