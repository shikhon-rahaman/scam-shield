import { describe, it, expect } from 'vitest';
import { sensitiveInfoSignal } from './sensitiveInfo';

describe('sensitiveInfoSignal', () => {
  it('detects OTP code requests', () => {
    const text = 'Share your OTP code with our executive to unblock your account.';
    const matches = sensitiveInfoSignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects CVV and ATM PIN requests', () => {
    const text = 'Please confirm your ATM PIN and CVV on the verification portal.';
    const matches = sensitiveInfoSignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('detects password and 16-digit card number requests', () => {
    const text = 'Enter your 16-digit card number and netbanking password.';
    const matches = sensitiveInfoSignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('ignores benign text without credential requests', () => {
    const text = 'Your package has been delivered to your front door.';
    const matches = sensitiveInfoSignal.detect(text);
    expect(matches).toEqual([]);
  });

  it('does NOT flag legitimate OTP delivery notifications that say DO NOT SHARE', () => {
    const text =
      'Your Example Bank verification code is 482910 for txn of $28.00. DO NOT SHARE this code with anyone, including bank staff.';
    const matches = sensitiveInfoSignal.detect(text);
    expect(matches).toEqual([]);
  });
});
