import { describe, it, expect } from 'vitest';
import { impersonationSignal } from './impersonation';

describe('impersonationSignal', () => {
  it('detects bank impersonation (SBI, HDFC, Chase)', () => {
    const text = 'Dear SBI customer, your netbanking access requires renewal.';
    const matches = impersonationSignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].text.toUpperCase()).toBe('SBI');
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects courier services (FedEx, DHL, USPS)', () => {
    const text = 'FedEx: Your shipment #93828 is waiting at the local hub.';
    const matches = impersonationSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text.toLowerCase()).toBe('fedex');
  });

  it('detects government & tax authorities (Income Tax, IRS)', () => {
    const text = 'Notice from the Income Tax Department: Tax refund approved.';
    const matches = impersonationSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text.toLowerCase()).toBe('income tax department');
  });

  it('detects tech support impersonation (Microsoft Support, Geek Squad)', () => {
    const text = 'Call Geek Squad or Microsoft Support to remove virus infection.';
    const matches = impersonationSignal.detect(text);
    expect(matches.length).toBe(2);
  });
});
