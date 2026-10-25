import { describe, it, expect } from 'vitest';
import { suspiciousLinksSignal } from './suspiciousLinks';

describe('suspiciousLinksSignal', () => {
  it('detects URL shorteners like bit.ly and tinyurl', () => {
    const text = 'Click here to claim your refund: http://bit.ly/refund-claim-2024';
    const matches = suspiciousLinksSignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].text).toContain('bit.ly/refund-claim-2024');
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects lookalike domains with number swaps (paypa1)', () => {
    const text = 'Login at https://paypa1-security.com/login to verify your payment.';
    const matches = suspiciousLinksSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text).toContain('paypa1-security.com');
  });

  it('detects raw IP addresses as hosts', () => {
    const text = 'Update bank details at http://192.168.1.100/sbi/update.html';
    const matches = suspiciousLinksSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text).toContain('192.168.1.100');
  });

  it('detects punycode spoof domains (xn--)', () => {
    const text = 'Visit https://xn--appl-4qa.com to claim support.';
    const matches = suspiciousLinksSignal.detect(text);
    expect(matches.length).toBe(1);
  });

  it('detects suspicious high-risk TLDs (.xyz, .top)', () => {
    const text = 'Check status at https://customs-parcel-clearance.xyz/track';
    const matches = suspiciousLinksSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text).toContain('.xyz');
  });

  it('detects insecure non-HTTPS links', () => {
    const text = 'Please check your portal at http://myportal-banking.com/verify';
    const matches = suspiciousLinksSignal.detect(text);
    expect(matches.length).toBe(1);
  });
});
