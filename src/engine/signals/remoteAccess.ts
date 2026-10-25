import { SignalDefinition } from '../types';
import { findPatternMatches } from '../utils/matchHelper';

export const remoteAccessSignal: SignalDefinition = {
  id: 'remote_access',
  label: 'Remote Screen Access / App Install',
  severity: 'critical',
  weight: 45,
  why: 'Instructs you to install unknown software or grant remote screen control to take over your device.',
  detect: (text: string) => {
    const patterns = [
      /\b(?:anydesk|teamviewer|quicksupport|rustdesk|airdroid|ultraviewer|zoho\s+assist)\b/i,
      /\b(?:install\s+(?:this\s+)?app|download\s+(?:the\s+)?apk|install\s+apk|download\s+app)\b/i,
      /\b(?:share\s+(?:your\s+)?screen|screen\s+sharing|screen\s+share)\b/i,
      /\b(?:grant|give|allow)\s+(?:remote\s+access|remote\s+control|screen\s+access)\b/i,
      /\b(?:install\s+support\s+app|download\s+security\s+app)\b/i,
      /\b(?:connect\s+to\s+your\s+phone|take\s+control\s+of\s+your\s+device)\b/i,
    ];

    return findPatternMatches(text, patterns);
  },
};
