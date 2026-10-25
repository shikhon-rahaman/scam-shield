import { SignalDefinition } from '../types';
import { findPatternMatches } from '../utils/matchHelper';

export const unsolicitedKycSignal: SignalDefinition = {
  id: 'unsolicited_kyc',
  label: 'Unsolicited KYC / Identity Update',
  severity: 'high',
  weight: 35,
  why: 'Demands urgent submission or verification of government identity documents like KYC, PAN, or Aadhaar.',
  detect: (text: string) => {
    const patterns = [
      /\b(?:update\s+(?:your\s+)?kyc|complete\s+(?:your\s+)?kyc|kyc\s+is\s+pending|kyc\s+expired)\b/i,
      /\b(?:kyc\s+verification|verify\s+(?:your\s+)?kyc|re[- ]verify\s+(?:your\s+)?account)\b/i,
      /\b(?:aadhaar\s+(?:card\s+)?(?:update|verification|link(?:ing)?)|update\s+(?:your\s+)?aadhaar)\b/i,
      /\b(?:pan\s+(?:card\s+)?(?:update|verification|link(?:ing)?)|link\s+pan\s+with\s+aadhaar)\b/i,
      /\b(?:upload|submit)\s+(?:your\s+)?(?:identity\s+proof|government\s+id|documents\s+immediately)\b/i,
      /\b(?:account\s+documents|kyc\s+compliance)\s+(?:incomplete|overdue|suspended)\b/i,
    ];

    return findPatternMatches(text, patterns);
  },
};
