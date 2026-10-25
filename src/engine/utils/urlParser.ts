import { TextMatch } from '../types';

const URL_REGEX = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`]+|[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.(?:com|org|net|in|co|xyz|top|work|icu|buzz|cam|click|fit|gq|cf|tk|ml|ga|cc|io|me|info|biz|live|vip)(?:\/[^\s<>"'{}|\\^`]*)?/gi;

const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  'is.gd',
  'cutt.ly',
  't.co',
  'rb.gy',
  'shorturl.at',
  'ow.ly',
  'tiny.cc',
  'buff.ly',
  'goo.gl',
  'v.gd',
  'trib.al',
  'lnkd.in',
  'qr.ae',
]);

const SUSPICIOUS_TLDS = new Set([
  'xyz',
  'top',
  'work',
  'icu',
  'buzz',
  'cam',
  'click',
  'fit',
  'gq',
  'cf',
  'tk',
  'ml',
  'ga',
  'rest',
  'country',
  'stream',
  'vip',
  'link',
]);

const LOOKALIKE_PATTERNS = [
  /paypa[l1i]/i,
  /g[o0][o0]gle/i,
  /amaz[o0]n/i,
  /app[l1i]e/i,
  /netf[l1i]x/i,
  /micr[o0]s[o0]ft/i,
  /faceb[o0][o0]k/i,
  /sbi[-_.]?(?:kyc|login|verify|card|service)/i,
  /hdfc[-_.]?(?:secure|update|netbanking|kyc)/i,
  /icici[-_.]?(?:login|alert|portal|kyc)/i,
  /chase[-_.]?(?:online|security|login)/i,
  /wellsfarg[o0]/i,
];

const IP_HOST_REGEX = /^(?:https?:\/\/)?(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/.*)?$/i;

export interface SuspiciousUrlEvaluation {
  isSuspicious: boolean;
  reasons: string[];
}

export function evaluateUrl(urlStr: string): SuspiciousUrlEvaluation {
  const reasons: string[] = [];
  const normalized = urlStr.trim().toLowerCase();

  // 1. IP address in URL
  if (IP_HOST_REGEX.test(normalized)) {
    reasons.push('IP-address host used instead of legitimate domain');
  }

  // 2. Non-HTTPS
  if (normalized.startsWith('http://')) {
    reasons.push('Insecure non-HTTPS connection (http://)');
  }

  // Extract hostname roughly
  let host = normalized.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  const pathIndex = host.indexOf('/');
  if (pathIndex !== -1) {
    host = host.substring(0, pathIndex);
  }
  const portIndex = host.indexOf(':');
  if (portIndex !== -1) {
    host = host.substring(0, portIndex);
  }

  // 3. Known Shorteners
  if (KNOWN_SHORTENERS.has(host)) {
    reasons.push('URL shortener masking the true destination address');
  }

  // 4. Punycode domains (IDN homograph attack)
  if (host.includes('xn--')) {
    reasons.push('Punycode domain (xn--) often used to spoof characters');
  }

  // 5. Lookalike / Typosquatting
  for (const pattern of LOOKALIKE_PATTERNS) {
    if (pattern.test(host)) {
      // Check if it's NOT the genuine root domain (e.g., paypal.com, google.com)
      const isGenuine =
        host === 'paypal.com' ||
        host === 'google.com' ||
        host === 'amazon.com' ||
        host === 'apple.com' ||
        host === 'netflix.com' ||
        host === 'microsoft.com' ||
        host === 'facebook.com';

      if (!isGenuine) {
        reasons.push('Lookalike domain or typo-squatting targeting a known brand');
        break;
      }
    }
  }

  // 6. Suspicious / Abused TLDs
  const parts = host.split('.');
  if (parts.length >= 2) {
    const tld = parts[parts.length - 1];
    if (SUSPICIOUS_TLDS.has(tld)) {
      reasons.push(`Suspicious or high-risk domain extension (.${tld})`);
    }
  }

  // 7. Very long subdomains (e.g. secure.login.bank.update.example.com or > 3 subdomains)
  if (parts.length > 4 || (host.length > 35 && parts.length >= 3)) {
    reasons.push('Excessively long subdomain structure mimicking official portal');
  }

  return {
    isSuspicious: reasons.length > 0,
    reasons,
  };
}

/**
 * Scans text for all URLs and returns matches that show suspicious characteristics.
 */
export function findSuspiciousUrlMatches(text: string): TextMatch[] {
  const matches: TextMatch[] = [];
  const regex = new RegExp(URL_REGEX.source, 'gi');

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const rawUrl = match[0];
    const evaluation = evaluateUrl(rawUrl);

    if (evaluation.isSuspicious) {
      matches.push({
        start: match.index,
        end: match.index + rawUrl.length,
        text: rawUrl,
      });
    }
  }

  return matches;
}
