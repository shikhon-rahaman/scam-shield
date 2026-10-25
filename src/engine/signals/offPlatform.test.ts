import { describe, it, expect } from 'vitest';
import { offPlatformSignal } from './offPlatform';

describe('offPlatformSignal', () => {
  it('detects Telegram redirection requests', () => {
    const text = 'If interested in this high-paying task, message me on Telegram @recruiter_job.';
    const matches = offPlatformSignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].text.toLowerCase()).toBe('message me on telegram');
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects WhatsApp redirection requests', () => {
    const text = 'For further details, contact our HR on WhatsApp right now.';
    const matches = offPlatformSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text.toLowerCase()).toBe('contact our hr on whatsapp');
  });

  it('detects t.me links', () => {
    const text = 'Join our private investment channel at t.me/crypto_vip_signals today.';
    const matches = offPlatformSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text).toContain('t.me/crypto_vip_signals');
  });

  it('ignores text without off-platform prompts', () => {
    const text = 'Your flight departure gate has moved to B12.';
    const matches = offPlatformSignal.detect(text);
    expect(matches).toEqual([]);
  });
});
