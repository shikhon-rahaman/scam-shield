import { Verdict } from './types';

/**
 * Deterministic verdict scoring thresholds.
 * - SCAM: Score >= 55 indicates high-probability fraud with multiple severe risk indicators.
 * - SUSPICIOUS: Score >= 20 indicates cautionary patterns warranting user vigilance.
 * - FINE: Score < 20 indicates no overt scam signals, but vigilance is still advised.
 */
export const THRESHOLDS = {
  SCAM: 55,
  SUSPICIOUS: 20,
} as const;

/**
 * Multiplier & bonus combinations for co-occurring signals.
 * Certain scam patterns are much more dangerous in combination.
 */
export const COMBOS = [
  {
    name: 'Credential Harvesting Under Duress',
    requiredSignalIds: ['sensitive_info', 'urgency'],
    bonusPoints: 25,
  },
  {
    name: 'Threat-Driven Phishing',
    requiredSignalIds: ['threats', 'suspicious_links'],
    bonusPoints: 25,
  },
  {
    name: 'Threat-Driven Extortion / Penalty Demand',
    requiredSignalIds: ['threats', 'money_request'],
    bonusPoints: 25,
  },
  {
    name: 'Impersonation with Fake Link',
    requiredSignalIds: ['impersonation', 'suspicious_links'],
    bonusPoints: 25,
  },
  {
    name: 'Urgent KYC Suspension',
    requiredSignalIds: ['unsolicited_kyc', 'threats'],
    bonusPoints: 25,
  },
  {
    name: 'Advance Fee Job/Lottery Scam',
    requiredSignalIds: ['too_good_to_be_true', 'money_request'],
    bonusPoints: 25,
  },
  {
    name: 'Remote Access Extortion',
    requiredSignalIds: ['remote_access', 'urgency'],
    bonusPoints: 30,
  },
  {
    name: 'Off-Platform Fraud Funnel',
    requiredSignalIds: ['too_good_to_be_true', 'off_platform'],
    bonusPoints: 20,
  },
] as const;

/**
 * Actionable next steps tailored per verdict and risk profile.
 * Notice: "fine" NEVER states 100% safe, adhering to strict safety guidelines.
 */
export const DEFAULT_NEXT_STEPS: Record<Verdict, string[]> = {
  scam: [
    'Do not click any links or tap any buttons in this message.',
    'Never share one-time passwords (OTP), PINs, CVVs, or login credentials with anyone.',
    'Do not transfer money, send advance fees, or buy gift cards.',
    'Block the sender and report the message as spam/phishing in your messaging app.',
    'If the message claims to be your bank or service provider, call the official number printed on the back of your card or utility bill.',
  ],
  suspicious: [
    'Do not click any links or call phone numbers mentioned in the message.',
    'Independently verify the sender by checking their verified official website or mobile app.',
    'Watch out for artificial urgency or requests to move conversations to Telegram or WhatsApp.',
    'Never send advance fees, security deposits, or grant remote access to your device.',
  ],
  fine: [
    'No overt scam patterns or dangerous trigger phrases were detected in this text.',
    'Always remain alert: legitimate institutions will never ask for your password, PIN, or OTP over text.',
    'If this message unexpectedly asks you for money or personal data later, verify directly with the organization.',
  ],
};
