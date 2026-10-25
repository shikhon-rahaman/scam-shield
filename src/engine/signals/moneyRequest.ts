import { SignalDefinition } from '../types';
import { findPatternMatches } from '../utils/matchHelper';

export const moneyRequestSignal: SignalDefinition = {
  id: 'money_request',
  label: 'Money / Upfront Payment Request',
  severity: 'high',
  weight: 30,
  why: 'Asks for upfront fees, advance deposits, or untraceable payments such as gift cards or cryptocurrency.',
  detect: (text: string) => {
    const patterns = [
      /\b(?:processing|registration|application|clearance|customs|delivery|admin)\s+(?:fee|charge|deposit)\b/i,
      /\b(?:security|refundable)\s+deposit\b/i,
      /\b(?:advance|upfront)\s+(?:fee|payment|charge)\b/i,
      /\b(?:send|transfer|wire|pay)\s+(?:money|funds|cash|amount)\b/i,
      /\b(?:settle|pay)\s+(?:your\s+)?(?:penalty|fine)\b/i,
      /\b(?:penalty|fine)\s+of\s+(?:\$|rs\.?|inr|usd)?\s*\d+\b/i,
      /\b(?:gift\s*card|itunes\s*card|steam\s*card|google\s*play\s*card|amazon\s*gift\s*card)\b/i,
      /\b(?:bitcoin|btc|crypto|cryptocurrency|usdt|eth|ethereum|crypto\s+wallet)\b/i,
      /\b(?:pay\s+a\s+fee|deposit\s+amount|wire\s+transfer)\b/i,
      /\b(?:pay\s+rs\.?\s*\d+|pay\s+\$\s*\d+|pay\s+inr\s*\d+)\s+(?:to\s+claim|to\s+receive|for\s+processing)\b/i,
    ];

    return findPatternMatches(text, patterns);
  },
};
