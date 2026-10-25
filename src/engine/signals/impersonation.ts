import { SignalDefinition } from '../types';
import { findPatternMatches } from '../utils/matchHelper';

export const impersonationSignal: SignalDefinition = {
  id: 'impersonation',
  label: 'Authority / Brand Impersonation',
  severity: 'high',
  weight: 25,
  why: 'Claims to represent a recognized financial institution, government body, or delivery service.',
  detect: (text: string) => {
    const patterns = [
      /\b(?:example\s+bank|quickparcel|fastcourier|apex\s+telecom|national\s+electric|govtax(?:\s+department)?)\b/i,
      /\b(?:state\s+bank\s+(?:of\s+india)?|sbi\s+bank|sbi|hdfc\s+bank|hdfc|icici\s+bank|icici|axis\s+bank|pnb|punjab\s+national\s+bank)\b/i,
      /\b(?:bank\s+of\s+america|chase\s+bank|wells\s+fargo|citibank|barclays|hsbc)\b/i,
      /\b(?:reserve\s+bank(?:\s+of\s+india)?|rbi|federal\s+reserve)\b/i,
      /\b(?:income\s+tax\s+department|irs|internal\s+revenue\s+service|tax\s+authority|customs\s+department)\b/i,
      /\b(?:fedex|dhl(?:\s+express)?|usps|united\s+states\s+postal\s+service|royal\s+mail|india\s+post|blue\s+dart)\b/i,
      /\b(?:airtel|jio|vodafone|vi|at&t|verizon|t-mobile)\b/i,
      /\b(?:microsoft\s+support|apple\s+support|google\s+(?:security|support)|whatsapp\s+support|geek\s+squad|tech\s+support)\b/i,
      /\b(?:electricity\s+department|power\s+corporation|water\s+board)\b/i,
    ];

    return findPatternMatches(text, patterns);
  },
};
