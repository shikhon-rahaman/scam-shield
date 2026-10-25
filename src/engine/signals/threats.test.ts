import { describe, it, expect } from 'vitest';
import { threatsSignal } from './threats';

describe('threatsSignal', () => {
  it('detects account blocked and locked threats', () => {
    const text = 'Dear user, your account has been blocked due to suspicious activity.';
    const matches = threatsSignal.detect(text);
    expect(matches.length).toBeGreaterThan(0);
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects legal action and arrest warrants', () => {
    const text = 'Failure to comply will result in immediate legal action and an arrest warrant.';
    const matches = threatsSignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('detects electricity disconnection and SIM deactivation', () => {
    const text = 'Notice: Your electricity will be disconnected tonight. SIM deactivation scheduled.';
    const matches = threatsSignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('ignores standard neutral text', () => {
    const text = 'Welcome to our monthly community newsletter!';
    const matches = threatsSignal.detect(text);
    expect(matches).toEqual([]);
  });
});
