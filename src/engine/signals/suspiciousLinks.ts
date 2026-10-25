import { SignalDefinition } from '../types';
import { findSuspiciousUrlMatches } from '../utils/urlParser';

export const suspiciousLinksSignal: SignalDefinition = {
  id: 'suspicious_links',
  label: 'Suspicious or Deceptive Link',
  severity: 'high',
  weight: 35,
  why: 'Contains deceptive, shortened, or lookalike web links designed to misdirect you.',
  detect: (text: string) => {
    return findSuspiciousUrlMatches(text);
  },
};
