import { SignalDefinition } from '../types';
import { findPatternMatches } from '../utils/matchHelper';

export const sensitiveInfoSignal: SignalDefinition = {
  id: 'sensitive_info',
  label: 'Sensitive Credential Request',
  severity: 'critical',
  weight: 40,
  why: 'Demands secret security credentials that authentic institutions never ask you to reveal.',
  detect: (text: string) => {
    const patterns = [
      /\b(?:share|send|enter|provide|forward|confirm|tell(?:\s+us)?|input|submit|reply\s+with)\s+(?:your\s+)?(?:otp|pin|cvv|cvc|password|passcode|code)\b/i,
      /\b(?:share|send|enter|provide|forward|confirm|give)\s+(?:your\s+)?(?:atm\s+pin|mpin|upi\s+pin)\b/i,
      /\b(?:share|send|enter|provide|confirm|give|submit)\s+(?:your\s+)?(?:cvv|cvc|security\s+code)\b/i,
      /\b(?:card\s+number|16[- ]digit(?:\s+card)?\s+number)\b/i,
      /\b(?:netbanking\s+password|login\s+password|banking\s+password)\b/i,
      /\b(?:share|send|enter|provide|forward|confirm)\s+(?:your\s+)?(?:verification|security)\s+code\b/i,
      /\b(?:credit|debit)\s+card\s+(?:details|pin)\b/i,
      /\b(?:share|send|enter|provide|confirm)\s+(?:your\s+)?(?:secret\s+code|6[- ]digit\s+code)\b/i,
      /\b(?:tell|give|share\s+with)\s+(?:the\s+)?(?:executive|agent|representative|caller)\s+(?:your\s+)?(?:otp|code|pin)\b/i,
      /\b(?:atm\s+pin|mpin|upi\s+pin|cvv|cvc)\b/i,
    ];

    const rawMatches = findPatternMatches(text, patterns);

    // Filter out matches that appear directly inside protective statements
    // e.g. "DO NOT SHARE this code", "never share your OTP", "will never ask for your code"
    return rawMatches.filter((m) => {
      const preceding = text.slice(Math.max(0, m.start - 40), m.start).toLowerCase();
      const isProtective =
        /(?:do\s+not|don't|never|will\s+not)\s+(?:share|disclose|give|reveal)?\s*$/i.test(preceding) ||
        /\b(?:do\s+not\s+share|never\s+share|don't\s+share)\b/i.test(preceding);
      return !isProtective;
    });
  },
};
