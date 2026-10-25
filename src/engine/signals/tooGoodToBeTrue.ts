import { SignalDefinition } from '../types';
import { findPatternMatches } from '../utils/matchHelper';

export const tooGoodToBeTrueSignal: SignalDefinition = {
  id: 'too_good_to_be_true',
  label: 'Too-Good-To-Be-True Offer',
  severity: 'high',
  weight: 30,
  why: 'Promises unrealistically easy money, guaranteed returns, lottery wins, or free luxury gifts.',
  detect: (text: string) => {
    const patterns = [
      /\b(?:congratulations|congrats)!?\s+(?:you(?:'ve|\s+have)?\s+(?:won|been\s+selected))\b/i,
      /\b(?:lottery(?:\s+prize|\s+winner)?|lucky\s+draw|jackpot\s+winner)\b/i,
      /\b(?:claim\s+(?:your\s+)?(?:prize|reward|gift|bonus|cash|iphone))\b/i,
      /\bearn\s+(?:\$|rs\.?|inr|usd)?\s*\d+\s*(?:per\s+day|daily|per\s+hour|every\s+day)\b/i,
      /\b(?:work\s+from\s+home|part[- ]time\s+job)\s+(?:with\s+)?(?:no\s+experience|simple\s+tasks|high\s+salary)\b/i,
      /\b(?:guaranteed\s+(?:returns?|profit|income|payout)|double\s+your\s+money)\b/i,
      /\b(?:free\s+iphone|free\s+gift\s+card|free\s+voucher)\b/i,
      /\b(?:exclusive\s+cash\s+bonus|cashback\s+reward\s+of\s+rs\.?\s*\d+)\b/i,
    ];

    return findPatternMatches(text, patterns);
  },
};
