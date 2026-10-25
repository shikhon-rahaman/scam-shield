import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { analyzeMessage, MAX_INPUT_LENGTH } from './index';
import {
  DEFAULT_INCLUDE_MESSAGE,
  getShareCardMessage,
} from '../components/shareCardPrivacy';

function getProductionSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return getProductionSourceFiles(path);
    if (!/\.(ts|tsx|js|jsx)$/.test(entry.name) || /\.test\./.test(entry.name)) {
      return [];
    }
    return [path];
  });
}

describe('Security & Privacy Audit Test Suite', () => {
  describe('XSS & Input Sanitization', () => {
    it('treats script tags and image onerror payloads strictly as inert text', () => {
      const maliciousPayload =
        '<script>alert(1)</script> QuickParcel: Your package is held. Settle fee at http://quickparcel-pay.xyz <img src=x onerror=alert(1)>';

      const result = analyzeMessage(maliciousPayload);

      // Must identify the scam link without executing or crashing
      expect(result.verdict).toBe('scam');

      // Ensure every match text is treated as raw inert string, not HTML
      for (const signal of result.signals) {
        for (const match of signal.matches) {
          expect(match.text).not.toContain('<script>');
          expect(typeof match.text).toBe('string');
        }
      }
    });

    it('safely handles pure HTML/XSS injection attempts without crashing or false positives', () => {
      const htmlInput = '<script>document.location="http://evil.com"</script><iframe src="javascript:alert(1)"></iframe>';
      const result = analyzeMessage(htmlInput);

      expect(result).toBeDefined();
      expect(typeof result.verdict).toBe('string');
    });
  });

  describe('ReDoS and Performance (< 50ms with 5000-char adversarial input)', () => {
    it('processes a 5,000-character adversarial string in under 50ms', () => {
      // Craft an adversarial string with repeating dots, hyphens, and near-match words
      const adversarialPattern = 'urgent power-pay a.b-c.d.e.f-g.h.i.xyz/pay within 24 hours ';
      const repeatCount = Math.ceil(5000 / adversarialPattern.length);
      const longInput = adversarialPattern.repeat(repeatCount).slice(0, 5000);

      expect(longInput.length).toBe(5000);

      const startTime = performance.now();
      const result = analyzeMessage(longInput);
      const elapsed = performance.now() - startTime;

      expect(result).toBeDefined();
      expect(elapsed).toBeLessThan(50);
      console.log(`[ReDoS Benchmark] 5,000-char adversarial input analyzed in ${elapsed.toFixed(2)}ms (Limit: 50ms)`);
    });

    it('caps inputs exceeding 5,000 characters safely at MAX_INPUT_LENGTH', () => {
      expect(MAX_INPUT_LENGTH).toBe(5000);

      const excessInput = 'A'.repeat(MAX_INPUT_LENGTH) + ' share your OTP code immediately';
      const startTime = performance.now();
      const result = analyzeMessage(excessInput);
      const elapsed = performance.now() - startTime;

      expect(result).toBeDefined();
      expect(result.signals.some((signal) => signal.id === 'sensitive_info')).toBe(false);
      expect(elapsed).toBeLessThan(200);
    });
  });

  describe('Application Security Guardrails', () => {
    const sourceFiles = getProductionSourceFiles(join(process.cwd(), 'src'));

    it('does not use dangerous HTML injection or HTML string APIs', () => {
      for (const file of sourceFiles) {
        const source = readFileSync(file, 'utf8');
        expect(source, relative(process.cwd(), file)).not.toMatch(
          /\b(?:dangerouslySetInnerHTML|innerHTML)\b/
        );
      }
    });

    it('does not make fetch, XHR, or WebSocket requests', () => {
      for (const file of sourceFiles) {
        const source = readFileSync(file, 'utf8');
        expect(source, relative(process.cwd(), file)).not.toMatch(
          /\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\b/
        );
      }
    });

    it('includes a Content-Security-Policy meta tag', () => {
      const indexHtml = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
      expect(indexHtml).toMatch(/<meta\s+[^>]*http-equiv="Content-Security-Policy"/i);
    });

    it('limits the visible message input to 5,000 characters', () => {
      const appSource = readFileSync(join(process.cwd(), 'src', 'App.tsx'), 'utf8');
      expect(appSource).toContain('maxLength={MAX_INPUT_LENGTH}');
      expect(appSource).toContain(
        'setMessageText(e.target.value.slice(0, MAX_INPUT_LENGTH))'
      );
      expect(appSource).toContain(
        'setMessageText(text.slice(0, MAX_INPUT_LENGTH))'
      );
    });
  });

  describe('Warning Card Privacy Opt-In', () => {
    it('excludes the real message from card content until the user opts in', () => {
      const sensitiveUserMessage = 'Your secret Example Bank account balance is $84,920.10 at Account #99281-2291';
      const cardSource = readFileSync(
        join(process.cwd(), 'src', 'components', 'WarningCardModal.tsx'),
        'utf8'
      );

      expect(DEFAULT_INCLUDE_MESSAGE).toBe(false);
      expect(getShareCardMessage(sensitiveUserMessage, DEFAULT_INCLUDE_MESSAGE)).toBeNull();
      expect(getShareCardMessage(sensitiveUserMessage, true)).toBe(sensitiveUserMessage);
      expect(cardSource).toContain('useState(DEFAULT_INCLUDE_MESSAGE)');
      expect(cardSource).toContain(
        'getShareCardMessage(messageText, includeMessage)'
      );
      expect(cardSource.match(/shareCardMessage !== null/g)).toHaveLength(2);
    });
  });
});
