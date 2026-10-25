import { describe, it, expect, afterAll } from 'vitest';
import { analyzeMessage } from '../index';
import { SCAM_FIXTURES, LEGITIMATE_FIXTURES, ALL_FIXTURES, samples } from './index';

describe('Fixtures Benchmark Test Suite', () => {
  let truePositives = 0;
  let trueNegatives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  describe('Scam Message Fixtures (14+ Realistic Scams, Fictional Brands Only)', () => {
    it('contains at least 14 scam fixtures', () => {
      expect(SCAM_FIXTURES.length).toBeGreaterThanOrEqual(14);
    });

    SCAM_FIXTURES.forEach((fixture) => {
      it(`[${fixture.id}] flags scam: ${fixture.name}`, () => {
        const result = analyzeMessage(fixture.text);

        if (result.verdict === 'scam') {
          truePositives++;
        } else {
          falseNegatives++;
        }

        // Expected verdict for every fixture
        expect(
          result.verdict,
          `Expected verdict "${fixture.expectedVerdict}" for fixture "${fixture.name}", but got "${result.verdict}" (score: ${result.score})`
        ).toBe(fixture.expectedVerdict);

        expect(result.verdict).toBe('scam');
        expect(result.score).toBeGreaterThanOrEqual(50);
        expect(result.signals.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Legitimate Message Fixtures (8+ Non-Scams, Fictional Brands Only)', () => {
    it('contains at least 8 legitimate fixtures', () => {
      expect(LEGITIMATE_FIXTURES.length).toBeGreaterThanOrEqual(8);
    });

    LEGITIMATE_FIXTURES.forEach((fixture) => {
      it(`[${fixture.id}] clears legitimate: ${fixture.name}`, () => {
        const result = analyzeMessage(fixture.text);

        if (result.verdict === 'scam') {
          falsePositives++;
        } else {
          trueNegatives++;
        }

        // Must NEVER be flagged as scam
        expect(
          result.verdict,
          `CRITICAL: Legitimate message "${fixture.name}" was FALSELY flagged as "${result.verdict}" (score: ${result.score})!`
        ).not.toBe('scam');

        // Expected verdict for every fixture
        expect(
          result.verdict,
          `Expected verdict "${fixture.expectedVerdict}" for fixture "${fixture.name}", got "${result.verdict}"`
        ).toBe(fixture.expectedVerdict);

        // Legitimate messages should evaluate to 'fine'
        expect(result.verdict).toBe('fine');
      });
    });
  });

  describe('All Fixtures Coverage Verification', () => {
    it('asserts expected verdict for every item in ALL_FIXTURES', () => {
      for (const fixture of ALL_FIXTURES) {
        const result = analyzeMessage(fixture.text);
        expect(
          result.verdict,
          `Fixture ${fixture.id} (${fixture.name}) expected ${fixture.expectedVerdict}, got ${result.verdict}`
        ).toBe(fixture.expectedVerdict);
      }
    });
  });

  describe('Samples Export Verification (UI "Try an example" Buttons)', () => {
    it('exports 6 curated samples spanning all verdicts', () => {
      expect(samples).toBeDefined();
      expect(samples).toHaveLength(6);

      const verdicts = new Set(samples.map((s) => s.verdict));
      expect(verdicts.has('scam'), 'Samples must include scam verdict').toBe(true);
      expect(verdicts.has('suspicious'), 'Samples must include suspicious verdict').toBe(true);
      expect(verdicts.has('fine'), 'Samples must include fine verdict').toBe(true);

      // Verify each sample produces its intended verdict
      for (const sample of samples) {
        const result = analyzeMessage(sample.text);
        expect(
          result.verdict,
          `Sample "${sample.title}" produced verdict "${result.verdict}", expected "${sample.verdict}"`
        ).toBe(sample.verdict);

        // Ensure title, name, category, and text are non-empty strings
        expect(sample.id).toBeTruthy();
        expect(sample.title).toBeTruthy();
        expect(sample.name).toBeTruthy();
        expect(sample.category).toBeTruthy();
        expect(sample.text).toBeTruthy();
      }
    });
  });

  afterAll(() => {
    const total = truePositives + trueNegatives + falsePositives + falseNegatives;
    const precision =
      truePositives + falsePositives > 0
        ? ((truePositives / (truePositives + falsePositives)) * 100).toFixed(1)
        : '0.0';
    const recall =
      truePositives + falseNegatives > 0
        ? ((truePositives / (truePositives + falseNegatives)) * 100).toFixed(1)
        : '0.0';
    const accuracy = total > 0 ? (((truePositives + trueNegatives) / total) * 100).toFixed(1) : '0.0';

    const border = '═'.repeat(60);
    const divider = '─'.repeat(60);

    console.log(`\n${border}`);
    console.log('       SCAM SHIELD DETECTION ENGINE PRECISION SUMMARY');
    console.log(border);
    console.log(`  Total Fixtures Tested : ${total} (${SCAM_FIXTURES.length} Scam, ${LEGITIMATE_FIXTURES.length} Legitimate)`);
    console.log(`  True Positives  (TP)  : ${truePositives} / ${SCAM_FIXTURES.length} scams correctly caught`);
    console.log(`  True Negatives  (TN)  : ${trueNegatives} / ${LEGITIMATE_FIXTURES.length} legitimate cleared`);
    console.log(`  False Positives (FP)  : ${falsePositives} (legitimate flagged as scam)`);
    console.log(`  False Negatives (FN)  : ${falseNegatives} (scams missed)`);
    console.log(divider);
    console.log(`  Precision             : ${precision}% (Target: 100.0%)`);
    console.log(`  Recall                : ${recall}% (Target: 100.0%)`);
    console.log(`  Overall Accuracy      : ${accuracy}%`);
    console.log(`${border}\n`);
  });
});
