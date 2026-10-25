import {
  AnalysisResult,
  DetectedSignal,
  Verdict,
} from './types';
import { ALL_SIGNALS } from './signals';
import { THRESHOLDS, COMBOS, DEFAULT_NEXT_STEPS } from './constants';

export * from './types';
export * from './constants';
export * from './signals';
export * from './fixtures';
export * from './explainSimply';

export const MAX_INPUT_LENGTH = 5000;

/**
 * Analyzes an incoming message string using a pure, deterministic, rule-based engine.
 * Runs 100% locally on the device with zero network calls or UI dependencies.
 *
 * @param text The untrusted text (SMS, WhatsApp, email snippet, job offer)
 * @returns Deterministic verdict, score (0-100), detected signals with exact matches, and next steps.
 */
export function analyzeMessage(text: string): AnalysisResult {
  if (!text || text.trim().length === 0) {
    return {
      verdict: 'fine',
      score: 0,
      signals: [],
      nextSteps: DEFAULT_NEXT_STEPS.fine,
    };
  }

  // Cap input safely at 5000 characters to prevent ReDoS / excessive execution overhead
  const safeText = text.length > MAX_INPUT_LENGTH ? text.slice(0, MAX_INPUT_LENGTH) : text;

  const detectedSignals: DetectedSignal[] = [];
  const detectedSignalIds = new Set<string>();

  // 1. Evaluate all 10 independent signals
  for (const signal of ALL_SIGNALS) {
    const matches = signal.detect(safeText);

    if (matches.length > 0) {
      detectedSignals.push({
        id: signal.id,
        label: signal.label,
        severity: signal.severity,
        weight: signal.weight,
        why: signal.why,
        matches,
      });
      detectedSignalIds.add(signal.id);
    }
  }

  // If the ONLY detected signal is a brand/authority mention with zero threats,
  // zero links, zero urgency, and zero requests, it is legitimate standard communication.
  if (detectedSignals.length === 1 && detectedSignals[0].id === 'impersonation') {
    return {
      verdict: 'fine',
      score: 0,
      signals: [],
      nextSteps: DEFAULT_NEXT_STEPS.fine,
    };
  }

  // 2. Compute base score from weights
  let rawScore = detectedSignals.reduce((total, s) => total + s.weight, 0);

  // 3. Apply compound risk multipliers (combos)
  for (const combo of COMBOS) {
    const hasAllRequired = combo.requiredSignalIds.every((reqId) =>
      detectedSignalIds.has(reqId)
    );

    if (hasAllRequired) {
      rawScore += combo.bonusPoints;
    }
  }

  // Score capped between 0 and 100
  const score = Math.min(100, Math.max(0, rawScore));

  // 4. Map score to deterministic verdict thresholds
  let verdict: Verdict;
  if (score >= THRESHOLDS.SCAM) {
    verdict = 'scam';
  } else if (score >= THRESHOLDS.SUSPICIOUS) {
    verdict = 'suspicious';
  } else {
    verdict = 'fine';
  }

  // 5. Build tailored next steps
  const nextSteps = buildNextSteps(verdict, detectedSignalIds);

  return {
    verdict,
    score,
    signals: detectedSignals,
    nextSteps,
  };
}

/**
 * Generates clear, actionable, prioritized instructions tailored to the specific threats detected.
 */
function buildNextSteps(verdict: Verdict, signalIds: Set<string>): string[] {
  const customSteps: string[] = [];

  if (signalIds.has('sensitive_info')) {
    customSteps.push('Never share one-time passwords (OTP), PINs, or security codes with anyone under any circumstances.');
  }

  if (signalIds.has('remote_access')) {
    customSteps.push('Do NOT install any application (like AnyDesk or APK files) or grant screen-sharing permission.');
  }

  if (signalIds.has('suspicious_links')) {
    customSteps.push('Do not click, tap, or preview any links in this message.');
  }

  if (signalIds.has('money_request')) {
    customSteps.push('Do not send any upfront fees, registration deposits, or gift cards.');
  }

  if (signalIds.has('off_platform')) {
    customSteps.push('Do not continue this conversation on Telegram or WhatsApp.');
  }

  if (signalIds.has('impersonation') || signalIds.has('unsolicited_kyc')) {
    customSteps.push('Contact your bank or provider only using the verified telephone number on the back of your card or official bill.');
  }

  // Merge with default steps for the verdict, avoiding duplicates
  const defaults = DEFAULT_NEXT_STEPS[verdict];
  const combined = [...customSteps, ...defaults];
  const uniqueSteps: string[] = [];

  for (const step of combined) {
    if (!uniqueSteps.includes(step)) {
      uniqueSteps.push(step);
    }
    if (uniqueSteps.length >= 5) break;
  }

  return uniqueSteps;
}
