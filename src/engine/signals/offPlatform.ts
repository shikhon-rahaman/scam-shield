import { SignalDefinition } from '../types';
import { findPatternMatches } from '../utils/matchHelper';

export const offPlatformSignal: SignalDefinition = {
  id: 'off_platform',
  label: 'Off-Platform Redirection',
  severity: 'medium',
  weight: 20,
  why: 'Directs you away from moderated environments into untraceable private messaging channels.',
  detect: (text: string) => {
    const patterns = [
      /\b(?:message|contact|reach|chat|dm|connect|speak)(?:\s+[a-z]{1,20}){0,3}\s+(?:on|via)\s+telegram\b/i,
      /\b(?:message|contact|reach|chat|dm|connect|speak)(?:\s+[a-z]{1,20}){0,3}\s+(?:on|via)\s+whatsapp\b/i,
      /\b(?:add\s+(?:me\s+)?on\s+whatsapp|whatsapp\s+me\s+at)\b/i,
      /\b(?:telegram\s+handle|t\.me\/[a-zA-Z0-9_]+)\b/i,
      /\b(?:move\s+to\s+telegram|switch\s+to\s+whatsapp)\b/i,
      /\bon\s+telegram\s+at\s+@[a-zA-Z0-9_]+\b/i,
    ];

    return findPatternMatches(text, patterns);
  },
};
