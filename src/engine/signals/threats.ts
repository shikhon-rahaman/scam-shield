import { SignalDefinition } from '../types';
import { findPatternMatches } from '../utils/matchHelper';

export const threatsSignal: SignalDefinition = {
  id: 'threats',
  label: 'Threats & Intimidation',
  severity: 'high',
  weight: 30,
  why: 'Uses intimidation like account suspension, legal action, or service cutoff to provoke panic.',
  detect: (text: string) => {
    const patterns = [
      /\b(?:account|card|profile|access)\s+(?:has\s+been\s+|is\s+|will\s+be\s+)?(?:blocked|suspended|locked|frozen|restricted|disabled)\b/i,
      /\b(?:will\s+be|may\s+be|shall\s+be)\s+(?:suspended|blocked|locked|frozen|disabled|terminated|closed)\b/i,
      /\b(?:legal\s+action|law\s+enforcement|police\s+(?:complaint|case|arrest)|arrest\s+warrant)\b/i,
      /\b(?:court\s+(?:order|notice|summons)|prosecution)\b/i,
      /\b(?:sim\s+(?:card\s+)?(?:deactivation|block(?:ed)?|disconnect(?:ed)?))\b/i,
      /\b(?:electricity|power)\s+(?:will\s+be\s+)?(?:disconnect(?:ed)?|cut\s+off)\b/i,
      /\b(?:permanently\s+(?:closed|suspended|disabled|blocked|deleted))\b/i,
      /\b(?:facing|subject\s+to)\s+(?:penalties|penalty|prosecution)\b/i,
    ];

    return findPatternMatches(text, patterns);
  },
};
