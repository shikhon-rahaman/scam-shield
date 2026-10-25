import { describe, it, expect } from 'vitest';
import { unsolicitedKycSignal } from './unsolicitedKyc';

describe('unsolicitedKycSignal', () => {
  it('detects update KYC and complete KYC demands', () => {
    const text = 'Dear customer, update your KYC immediately to keep using debit services.';
    const matches = unsolicitedKycSignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].text.toLowerCase()).toBe('update your kyc');
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects Aadhaar and PAN card linking demands', () => {
    const text = 'Notice: Link PAN with Aadhaar before midnight to avoid tax penalty.';
    const matches = unsolicitedKycSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text.toLowerCase()).toBe('link pan with aadhaar');
  });

  it('detects KYC expired alerts', () => {
    const text = 'Your bank KYC expired. Please re-verify your account now.';
    const matches = unsolicitedKycSignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('ignores standard non-KYC messages', () => {
    const text = 'Meeting rescheduled to 3 PM in Conference Room A.';
    const matches = unsolicitedKycSignal.detect(text);
    expect(matches).toEqual([]);
  });
});
