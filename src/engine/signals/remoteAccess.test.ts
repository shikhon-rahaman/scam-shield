import { describe, it, expect } from 'vitest';
import { remoteAccessSignal } from './remoteAccess';

describe('remoteAccessSignal', () => {
  it('detects remote screen access apps (AnyDesk, TeamViewer, QuickSupport)', () => {
    const text = 'Kindly install AnyDesk or TeamViewer to allow our technical engineer to assist.';
    const matches = remoteAccessSignal.detect(text);
    expect(matches.length).toBe(2);
    expect(text.slice(matches[0].start, matches[0].end)).toBe(matches[0].text);
  });

  it('detects requests to install APKs or download apps', () => {
    const text = 'Download the APK from this link and install this app to verify your refund.';
    const matches = remoteAccessSignal.detect(text);
    expect(matches.length).toBe(2);
  });

  it('detects requests to share your screen', () => {
    const text = 'Please share your screen during the call so we can complete bank verification.';
    const matches = remoteAccessSignal.detect(text);
    expect(matches.length).toBe(1);
    expect(matches[0].text.toLowerCase()).toBe('share your screen');
  });

  it('ignores standard non-software text', () => {
    const text = 'Thanks for visiting our store today. See you again!';
    const matches = remoteAccessSignal.detect(text);
    expect(matches).toEqual([]);
  });
});
