import { describe, it, expect } from 'vitest';
import { analyzeMessage } from './index';
import { getSimpleExplanation } from './explainSimply';

describe('Explain Simply Engine Tests', () => {
  it('returns 3-step Do/Don\'t layout for scam messages', () => {
    const analysis = analyzeMessage(
      'URGENT: Your Example Bank account has been locked. Share your OTP code immediately to avoid suspension.'
    );
    const explanation = getSimpleExplanation(analysis);

    expect(explanation.headline).toBeTruthy();
    expect(explanation.simpleSummary).toBeTruthy();
    expect(explanation.steps).toHaveLength(3);

    for (const step of explanation.steps) {
      expect(step.stepNumber).toBeGreaterThan(0);
      expect(step.title).toBeTruthy();
      expect(step.doThis).toBeTruthy();
      expect(step.dontDoThis).toBeTruthy();
      // Ensure no technical jargon
      expect(step.doThis.toLowerCase()).not.toContain('regex');
      expect(step.dontDoThis.toLowerCase()).not.toContain('deterministic');
    }
  });

  it('customizes Step 2 when remote access is detected', () => {
    const analysis = analyzeMessage(
      'Tech support alert: install AnyDesk immediately and grant remote access to your screen.'
    );
    const explanation = getSimpleExplanation(analysis);

    expect(explanation.steps[1].dontDoThis.toLowerCase()).toContain('anydesk');
  });

  it('customizes Step 2 when money/gift card request is detected', () => {
    const analysis = analyzeMessage(
      'Congratulations! You won $50,000. Pay registration fee of $150 via Amazon gift card or Bitcoin to claim.'
    );
    const explanation = getSimpleExplanation(analysis);

    expect(explanation.steps[1].dontDoThis.toLowerCase()).toContain('gift card');
  });

  it('returns 3-step Do/Don\'t layout for legitimate messages', () => {
    const analysis = analyzeMessage(
      'Example Bank Alert: Your debit card ending in 4102 was charged $34.50 at Corner Supermarket.'
    );
    const explanation = getSimpleExplanation(analysis);

    expect(explanation.steps).toHaveLength(3);
    expect(explanation.headline).toBe('This message looks normal.');
  });
});
