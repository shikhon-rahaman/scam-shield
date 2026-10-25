import { SignalDefinition } from '../types';
import { findPatternMatches } from '../utils/matchHelper';

export const urgencySignal: SignalDefinition = {
  id: 'urgency',
  label: 'Urgency & Pressure',
  severity: 'medium',
  weight: 15,
  why: 'Pressures you to act hastily before you have time to think or verify.',
  detect: (text: string) => {
    const patterns = [
      /\b(?:immediately|immediate\s+attention|immediate\s+action)\b/i,
      /\bwithin\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)\b/i,
      /\b(?:last|final)\s+warning\b/i,
      /\bfinal\s+notice\b/i,
      /\b(?:act\s+now|action\s+required\s+now|act\s+immediately)\b/i,
      /\btime\s+is\s+running\s+out\b/i,
      /\b(?:right\s+now|right\s+away|without\s+delay)\b/i,
      /\bexpires?\s+(?:today|in\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)|soon)\b/i,
      /\b(?:urgent|urgently|urgency)\b/i,
      /\bbefore\s+it(?:'s|\s+is)\s+too\s+late\b/i,
      /\b(?:last\s+chance|don't\s+delay|hurry\s+up)\b/i,
    ];

    return findPatternMatches(text, patterns);
  },
};
