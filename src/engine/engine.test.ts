import { describe, it, expect } from 'vitest';
import { analyzeMessage } from './index';
import { THRESHOLDS } from './constants';

describe('analyzeMessage Engine', () => {
  it('identifies classic Bank KYC Phishing as scam', () => {
    const text =
      'URGENT: Your SBI account has been locked due to incomplete KYC! Update your Aadhaar card immediately at http://bit.ly/sbi-kyc-verify within 24 hours to prevent permanent account suspension.';

    const result = analyzeMessage(text);

    expect(result.verdict).toBe('scam');
    expect(result.score).toBeGreaterThanOrEqual(THRESHOLDS.SCAM);
    expect(result.signals.length).toBeGreaterThanOrEqual(4);

    const signalIds = result.signals.map((s) => s.id);
    expect(signalIds).toContain('urgency');
    expect(signalIds).toContain('threats');
    expect(signalIds).toContain('unsolicited_kyc');
    expect(signalIds).toContain('suspicious_links');
    expect(signalIds).toContain('impersonation');

    // Verify all matches are valid spans in original text
    for (const signal of result.signals) {
      expect(signal.why.length).toBeGreaterThan(10);
      for (const m of signal.matches) {
        expect(text.slice(m.start, m.end)).toBe(m.text);
      }
    }

    // Verify next steps are protective
    expect(result.nextSteps.some((step) => step.toLowerCase().includes('not click'))).toBe(true);
  });

  it('identifies OTP credential theft attempts as scam', () => {
    const text =
      'Dear Customer, to avoid credit card deactivation, please share your OTP code immediately with our representative.';

    const result = analyzeMessage(text);

    expect(result.verdict).toBe('scam');
    expect(result.score).toBeGreaterThanOrEqual(THRESHOLDS.SCAM);
    expect(result.signals.some((s) => s.id === 'sensitive_info')).toBe(true);
    expect(result.signals.some((s) => s.id === 'urgency')).toBe(true);
    expect(result.nextSteps.some((step) => step.toLowerCase().includes('otp'))).toBe(true);
  });

  it('identifies Work From Home Task scams with upfront fee & Telegram funnel as scam', () => {
    const text =
      'Congratulations! You have been selected for part-time job with no experience. Earn $500 per day. Pay registration fee of $20 and message me on Telegram @hiring_team.';

    const result = analyzeMessage(text);

    expect(result.verdict).toBe('scam');
    const ids = result.signals.map((s) => s.id);
    expect(ids).toContain('too_good_to_be_true');
    expect(ids).toContain('money_request');
    expect(ids).toContain('off_platform');
  });

  it('identifies remote screen takeover attempts as scam', () => {
    const text =
      'Microsoft Support: Virus detected on your computer. Install AnyDesk and grant remote access to clean your device.';

    const result = analyzeMessage(text);

    expect(result.verdict).toBe('scam');
    expect(result.signals.some((s) => s.id === 'remote_access')).toBe(true);
    expect(result.nextSteps.some((step) => step.toLowerCase().includes('install'))).toBe(true);
  });

  it('flags isolated suspicious link with urgency as suspicious or scam', () => {
    const text = 'Notice: Please review your profile changes within 24 hours at http://portal-check.xyz/view';

    const result = analyzeMessage(text);

    expect(['suspicious', 'scam']).toContain(result.verdict);
    expect(result.score).toBeGreaterThanOrEqual(THRESHOLDS.SUSPICIOUS);
  });

  it('rates normal, everyday communication as "fine" while maintaining safety advice', () => {
    const text = 'Hey Dad, are we still meeting for lunch at the Italian restaurant at 1:30 PM? Let me know!';

    const result = analyzeMessage(text);

    expect(result.verdict).toBe('fine');
    expect(result.score).toBe(0);
    expect(result.signals).toHaveLength(0);

    // Safety rule: never promises 100% safe
    expect(JSON.stringify(result)).not.toContain('100% safe');
    expect(result.nextSteps.length).toBeGreaterThan(0);
    expect(result.nextSteps.some((step) => step.toLowerCase().includes('cautious') || step.toLowerCase().includes('never ask'))).toBe(true);
  });

  it('gracefully handles empty and whitespace text', () => {
    const result = analyzeMessage('   \n  ');

    expect(result.verdict).toBe('fine');
    expect(result.score).toBe(0);
    expect(result.signals).toEqual([]);
    expect(result.nextSteps.length).toBeGreaterThan(0);
  });
});
