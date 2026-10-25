export type Verdict = 'scam' | 'suspicious' | 'fine';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface TextMatch {
  start: number;
  end: number;
  text: string;
}

export interface DetectedSignal {
  id: string;
  label: string;
  severity: Severity;
  weight: number;
  why: string;
  matches: TextMatch[];
}

export interface SignalDefinition {
  id: string;
  label: string;
  severity: Severity;
  weight: number;
  why: string;
  detect: (text: string) => TextMatch[];
}

export interface AnalysisResult {
  verdict: Verdict;
  score: number;
  signals: DetectedSignal[];
  nextSteps: string[];
}
