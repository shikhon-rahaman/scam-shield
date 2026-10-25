import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DesignSystemPage } from './pages/DesignSystemPage';
import {
  Button,
  Card,
  CardHeader,
  CardDescription,
  Badge,
  Toggle,
  Tooltip,
  WarningCardModal,
} from './components';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  Lock,
  WifiOff,
  HeartHandshake,
  ClipboardPaste,
  RotateCcw,
  Share2,
  Sparkles,
  HelpCircle,
  KeyRound,
  Laptop,
  ExternalLink,
  CreditCard,
  Clock,
  Gift,
  FileText,
  Building2,
  MessageSquare,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import {
  analyzeMessage,
  AnalysisResult,
  Severity,
  samples,
  SamplePreset,
  getSimpleExplanation,
  MAX_INPUT_LENGTH,
} from './engine';

interface HighlightSpan {
  start: number;
  end: number;
  text: string;
  signalId: string;
  signalLabel: string;
  severity: Severity;
  why: string;
}

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname.toLowerCase().includes('design') ||
      window.location.hash.toLowerCase().includes('design')
      ? '/design'
      : '/';
  });

  const [messageText, setMessageText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [explainSimply, setExplainSimply] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showWarningCardModal, setShowWarningCardModal] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const resultsRef = useRef<HTMLElement>(null);
  const verdictHeadingRef = useRef<HTMLHeadingElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check user motion preferences
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Animated risk meter (fills smoothly over ~600ms, or instant if reduced motion)
  useEffect(() => {
    if (!analysis) {
      setAnimatedScore(0);
      return;
    }

    if (prefersReducedMotion) {
      setAnimatedScore(analysis.score);
      return;
    }

    setAnimatedScore(0);
    const target = analysis.score;
    const duration = 600; // ms
    const start = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic: 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [analysis, prefersReducedMotion]);

  useEffect(() => {
    const handleLocationChange = () => {
      const isDesign =
        window.location.pathname.toLowerCase().includes('design') ||
        window.location.hash.toLowerCase().includes('design');
      setCurrentPath(isDesign ? '/design' : '/');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  const handleCheck = () => {
    const trimmed = messageText.trim();
    if (!trimmed) {
      setValidationError('Please paste or type a message first so we can check it for you.');
      setHasChecked(false);
      setAnalysis(null);
      return;
    }

    if (trimmed.length < 10) {
      setValidationError(
        'This message is a bit too short to inspect accurately. Please enter at least 10 characters, or tap an example below.'
      );
      setHasChecked(false);
      setAnalysis(null);
      return;
    }

    setValidationError(null);
    setIsAnalyzing(true);

    // Micro-delay for reassuring feedback & zero layout jump
    const checkDelay = prefersReducedMotion ? 0 : 120;
    setTimeout(() => {
      const result = analyzeMessage(trimmed);
      setAnalysis(result);
      setHasChecked(true);
      setIsAnalyzing(false);

      // Focus management: move focus and scroll smoothly into results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
        verdictHeadingRef.current?.focus();
      }, prefersReducedMotion ? 20 : 150);
    }, checkDelay);
  };

  const handleCheckAnother = () => {
    setMessageText('');
    setAnalysis(null);
    setHasChecked(false);
    setValidationError(null);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'center',
        });
        textareaRef.current.focus();
      }
    }, 60);
  };

  const handlePaste = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim().length > 0) {
          setMessageText(text.slice(0, MAX_INPUT_LENGTH));
          setValidationError(null);
          setHasChecked(false);
          setAnalysis(null);
          return;
        }
      }
      setValidationError('Clipboard is empty. Copy a message first, then tap Paste.');
    } catch {
      setValidationError(
        'Could not access clipboard automatically. Please press Ctrl+V or long-press inside the box to paste.'
      );
    }
  };

  const handleClear = () => {
    setMessageText('');
    setValidationError(null);
    setHasChecked(false);
    setAnalysis(null);
    textareaRef.current?.focus();
  };

  const handleSelectExample = (sample: SamplePreset) => {
    setMessageText(sample.text.slice(0, MAX_INPUT_LENGTH));
    setValidationError(null);
    setHasChecked(false);
    setAnalysis(null);
  };

  // Plain-English explanation when "Explain simply" is active
  const simpleExplanation = useMemo(() => {
    if (!analysis) return null;
    return getSimpleExplanation(analysis);
  }, [analysis]);

  // Signals sorted strictly by severity (critical -> high -> medium -> low)
  const sortedSignals = useMemo(() => {
    if (!analysis) return [];
    const SEVERITY_ORDER: Record<Severity, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...analysis.signals].sort((a, b) => {
      const diff = SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];
      if (diff !== 0) return diff;
      return b.weight - a.weight;
    });
  }, [analysis]);

  // Extract non-overlapping highlighted spans mapped with signal reasons
  const highlightedSpans = useMemo(() => {
    if (!analysis) return [];
    const allSpans: HighlightSpan[] = [];

    for (const signal of analysis.signals) {
      for (const match of signal.matches) {
        allSpans.push({
          start: match.start,
          end: match.end,
          text: match.text,
          signalId: signal.id,
          signalLabel: signal.label,
          severity: signal.severity,
          why: signal.why,
        });
      }
    }

    const SEVERITY_WEIGHT: Record<Severity, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    allSpans.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
    });

    const filtered: HighlightSpan[] = [];
    let currentEnd = 0;

    for (const span of allSpans) {
      if (span.start >= currentEnd) {
        filtered.push(span);
        currentEnd = span.end;
      }
    }

    return filtered;
  }, [analysis]);

  const getSignalIcon = (id: string) => {
    switch (id) {
      case 'sensitive_info':
        return <KeyRound size={22} className="text-verdict-scam" aria-hidden="true" />;
      case 'remote_access':
        return <Laptop size={22} className="text-verdict-scam" aria-hidden="true" />;
      case 'suspicious_links':
        return <ExternalLink size={22} className="text-verdict-scam" aria-hidden="true" />;
      case 'money_request':
        return <CreditCard size={22} className="text-verdict-scam" aria-hidden="true" />;
      case 'threats':
        return <AlertOctagon size={22} className="text-verdict-scam" aria-hidden="true" />;
      case 'urgency':
        return <Clock size={22} className="text-verdict-suspicious" aria-hidden="true" />;
      case 'too_good_to_be_true':
        return <Gift size={22} className="text-verdict-suspicious" aria-hidden="true" />;
      case 'unsolicited_kyc':
        return <FileText size={22} className="text-verdict-scam" aria-hidden="true" />;
      case 'impersonation':
        return <Building2 size={22} className="text-verdict-suspicious" aria-hidden="true" />;
      case 'off_platform':
        return <MessageSquare size={22} className="text-verdict-suspicious" aria-hidden="true" />;
      default:
        return <AlertTriangle size={22} className="text-verdict-suspicious" aria-hidden="true" />;
    }
  };

  const getHighlightClass = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-verdict-scam-subtle text-verdict-scam-text border-b-2 border-verdict-scam underline decoration-verdict-scam decoration-2 underline-offset-4 decoration-wavy font-semibold px-1 py-0.5 rounded cursor-pointer break-words';
      case 'high':
        return 'bg-verdict-scam-subtle/80 text-verdict-scam-text border-b-2 border-verdict-scam/80 underline decoration-verdict-scam/80 decoration-2 underline-offset-2 decoration-solid font-semibold px-1 py-0.5 rounded cursor-pointer break-words';
      case 'medium':
        return 'bg-verdict-suspicious-subtle text-verdict-suspicious-text border-b-2 border-verdict-suspicious underline decoration-verdict-suspicious decoration-2 underline-offset-2 decoration-dashed font-semibold px-1 py-0.5 rounded cursor-pointer break-words';
      case 'low':
        return 'bg-surface-subtle text-ink border-b-2 border-ink-muted underline decoration-ink-muted decoration-1 underline-offset-2 decoration-dotted font-medium px-1 py-0.5 rounded cursor-pointer break-words';
      default:
        return 'bg-surface-subtle text-ink underline font-medium px-1 py-0.5 rounded cursor-pointer break-words';
    }
  };

  const renderWhatWeNoticed = () => {
    if (!analysis || highlightedSpans.length === 0) {
      return <span>{messageText}</span>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    highlightedSpans.forEach((span, idx) => {
      if (span.start > lastIndex) {
        elements.push(
          <span key={`plain-${lastIndex}`}>{messageText.slice(lastIndex, span.start)}</span>
        );
      }

      elements.push(
        <Tooltip
          key={`highlight-${span.start}-${span.end}-${idx}`}
          content={
            <div className="space-y-1 text-left p-0.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-body-sm text-ink">
                  {span.signalLabel}
                </span>
                <span
                  className={`text-[11px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    span.severity === 'critical' || span.severity === 'high'
                      ? 'bg-verdict-scam text-white'
                      : 'bg-verdict-suspicious text-white'
                  }`}
                >
                  {span.severity}
                </span>
              </div>
              <p className="text-caption text-ink-muted leading-tight">
                {span.why}
              </p>
            </div>
          }
        >
          <button
            type="button"
            className={getHighlightClass(span.severity)}
            aria-label={`${span.signalLabel} warning (${span.severity}): ${span.why}`}
          >
            {messageText.slice(span.start, span.end)}
          </button>
        </Tooltip>
      );

      lastIndex = span.end;
    });

    if (lastIndex < messageText.length) {
      elements.push(
        <span key={`plain-${lastIndex}`}>{messageText.slice(lastIndex)}</span>
      );
    }

    return <>{elements}</>;
  };

  // If on /design route, render the complete Design System Page
  if (currentPath === '/design') {
    return (
      <div>
        <div className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border py-2.5 px-4 text-center">
          <div className="max-w-shield mx-auto flex items-center justify-between">
            <span className="text-caption font-medium text-ink-muted">
              Design System Component Gallery
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigateTo('/')}
              leftIcon={<Shield size={16} />}
            >
              Back to Scam Shield
            </Button>
          </div>
        </div>
        <DesignSystemPage />
      </div>
    );
  }

  // Plain language verdict strings as required
  const plainLanguageVerdict =
    analysis?.verdict === 'scam'
      ? 'This looks like a scam'
      : analysis?.verdict === 'suspicious'
      ? 'Be careful with this one'
      : 'Looks okay, but verify';

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-between transition-colors duration-normal">
      {/* Skip to Main Content Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-elevated focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {/* Header: small logo mark + "Scam Shield". No navigation clutter. */}
      <header className="border-b border-border-subtle bg-surface/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-shield mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl bg-primary text-primary-text flex items-center justify-center shadow-subtle shrink-0"
              aria-hidden="true"
            >
              <Shield size={20} className="text-white" />
            </div>
            <span className="font-heading font-bold text-heading-md text-ink tracking-tight">
              Scam Shield
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-caption font-medium text-ink-muted bg-surface-subtle px-3 py-1.5 rounded-full border border-border-subtle select-none">
            <Lock size={13} className="text-primary shrink-0" aria-hidden="true" />
            <span>100% on-device</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 py-8 sm:py-12">
        <div className="w-full max-w-shield mx-auto px-4 sm:px-6">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight mb-3 sm:mb-4 leading-tight">
              Got a message that feels off?
            </h1>
            <p className="text-body sm:text-body-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
              Paste it here. We'll tell you if it's a scam, in seconds. Nothing leaves your device.
            </p>
          </div>

          {/* Main Input Card */}
          <Card variant="default" radius="md" className="space-y-4 shadow-card">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label
                htmlFor="message-input"
                className="text-body font-semibold text-ink flex items-center gap-2"
              >
                <span>Suspicious message text</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="inline-flex items-center gap-1.5 text-caption font-medium text-primary hover:text-primary-hover bg-primary-subtle/80 hover:bg-primary-subtle px-3.5 py-2 min-h-[44px] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]"
                  aria-label="Paste message from clipboard"
                >
                  <ClipboardPaste size={16} aria-hidden="true" />
                  <span>Paste</span>
                </button>

                {messageText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-1.5 text-caption font-medium text-ink-muted hover:text-ink px-3 py-2 min-h-[44px] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]"
                    aria-label="Clear message text"
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                id="message-input"
                rows={6}
                maxLength={MAX_INPUT_LENGTH}
                value={messageText}
                onChange={(e) => {
                  setMessageText(e.target.value.slice(0, MAX_INPUT_LENGTH));
                  if (validationError) setValidationError(null);
                  setHasChecked(false);
                }}
                placeholder="Paste any SMS, WhatsApp alert, bank email, or job offer here..."
                aria-invalid={Boolean(validationError)}
                aria-describedby={
                  validationError ? 'validation-error-msg' : 'char-counter-info'
                }
                className="w-full p-4 rounded-card-sm border border-border bg-surface-subtle text-ink font-body text-body min-h-[170px] focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-fast resize-y leading-relaxed break-words"
              />
            </div>

            {/* Character-safe feedback and helper text */}
            <div
              className="flex items-center justify-between text-caption text-ink-muted px-1"
              id="char-counter-info"
            >
              <span>
                {messageText.length > 0
                  ? `${messageText.length} character${messageText.length === 1 ? '' : 's'}`
                  : 'Characters are inspected locally without uploading'}
              </span>
              {messageText.length > 2500 && (
                <span className="text-verdict-suspicious font-medium">
                Long message ({messageText.length} of {MAX_INPUT_LENGTH} chars)
                </span>
              )}
            </div>

            {/* Empty state & friendly validation feedback */}
            {validationError && (
              <div
                id="validation-error-msg"
                role="alert"
                className="p-3.5 rounded-card-sm bg-verdict-suspicious-subtle/90 border border-verdict-suspicious-border text-verdict-suspicious-text flex items-start gap-2.5 text-body-sm font-medium animate-in fade-in duration-fast"
              >
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-verdict-suspicious" aria-hidden="true" />
                <span className="leading-snug">{validationError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
              <Toggle
                label="Explain simply mode"
                description="Plain language for older family members & beginners"
                checked={explainSimply}
                onChange={setExplainSimply}
              />

              <Button
                size="lg"
                variant="primary"
                onClick={handleCheck}
                isLoading={isAnalyzing}
                leftIcon={<ShieldCheck size={22} />}
                className="w-full sm:w-auto min-h-[48px] sm:min-h-[52px] shadow-card font-semibold active:scale-[0.98]"
              >
                Check this message
              </Button>
            </div>
          </Card>

          {/* "Try an example" chips below the input */}
          <div className="mt-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-caption font-semibold uppercase tracking-wider text-ink-muted">
                Try an example:
              </p>
              <span className="text-caption text-ink-dim hidden sm:inline">
                Tap a chip to fill in a realistic sample
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {samples.map((preset) => {
                const isSelected = messageText === preset.text;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectExample(preset)}
                    aria-pressed={isSelected}
                    className={`min-h-[44px] px-4 py-2 rounded-full border text-caption sm:text-body-sm font-medium transition-all duration-fast flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-subtle'
                        : 'bg-surface hover:bg-surface-subtle text-ink border-border shadow-subtle'
                    }`}
                  >
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${
                        preset.verdict === 'scam'
                          ? 'bg-verdict-scam'
                          : preset.verdict === 'suspicious'
                          ? 'bg-verdict-suspicious'
                          : 'bg-verdict-fine'
                      }`}
                      aria-hidden="true"
                    />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Empty state guidance when user hasn't checked yet */}
          {!hasChecked && !analysis && (
            <div className="p-5 sm:p-6 rounded-card-sm bg-surface-subtle/80 border border-border-subtle flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                <HelpCircle size={20} aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="font-semibold text-body text-ink">
                  How Scam Shield protects you
                </h2>
                <p className="text-body-sm text-ink-muted leading-relaxed">
                  Paste any suspicious text above or tap one of the example chips. Our deterministic rule engine checks for urgency pressure, fake verification links, credential theft, and 7 other scam patterns in milliseconds.
                </p>
              </div>
            </div>
          )}

          {/* RESULTS VIEW (Animated Transition with Focus Management & aria-live) */}
          {hasChecked && analysis && (
            <section
              ref={resultsRef}
              tabIndex={-1}
              aria-labelledby="verdict-heading"
              aria-live="polite"
              aria-atomic="true"
              className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-protective focus:outline-none"
            >
              {/* Screen reader announcement */}
              <p className="sr-only">
                Analysis complete. Verdict: {plainLanguageVerdict}. Risk score: {analysis.score} out of 100.
              </p>

              {/* 1. Verdict Hero Card */}
              <Card
                variant={
                  analysis.verdict === 'scam'
                    ? 'verdict-scam'
                    : analysis.verdict === 'suspicious'
                    ? 'verdict-suspicious'
                    : 'verdict-fine'
                }
                radius="lg"
                className="shadow-elevated border-2"
              >
                <CardHeader className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Large Verdict Icon */}
                      <div className="shrink-0" aria-hidden="true">
                        {analysis.verdict === 'scam' ? (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-card bg-verdict-scam-subtle text-verdict-scam border border-verdict-scam-border flex items-center justify-center shadow-card">
                            <ShieldAlert size={42} className="text-verdict-scam" />
                          </div>
                        ) : analysis.verdict === 'suspicious' ? (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-card bg-verdict-suspicious-subtle text-verdict-suspicious border border-verdict-suspicious-border flex items-center justify-center shadow-card">
                            <AlertTriangle size={42} className="text-verdict-suspicious" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-card bg-verdict-fine-subtle text-verdict-fine border border-verdict-fine-border flex items-center justify-center shadow-card">
                            <ShieldCheck size={42} className="text-verdict-fine" />
                          </div>
                        )}
                      </div>

                      <div>
                        <Badge
                          variant={analysis.verdict}
                          size="md"
                          className="mb-1.5"
                        >
                          {analysis.verdict === 'scam'
                            ? 'Likely Scam'
                            : analysis.verdict === 'suspicious'
                            ? 'Caution Advised'
                            : 'Normal Message'}
                        </Badge>
                        {/* Plain language verdict word with focus ref */}
                        <h2
                          ref={verdictHeadingRef}
                          id="verdict-heading"
                          tabIndex={-1}
                          className="font-heading font-bold text-heading-lg sm:text-heading-xl text-ink leading-tight focus:outline-none"
                        >
                          {plainLanguageVerdict}
                        </h2>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="text-caption font-semibold uppercase tracking-wider text-ink-muted block">
                        Composite Risk
                      </span>
                      <span className="font-heading font-bold text-heading-xl sm:text-display text-ink">
                        {animatedScore}
                        <span className="text-heading-md font-normal text-ink-muted">/100</span>
                      </span>
                    </div>
                  </div>

                  {/* Verdict Description: 20px+ text when Explain Simply is enabled */}
                  <CardDescription
                    className={`leading-relaxed ${
                      explainSimply
                        ? 'text-[20px] sm:text-[22px] font-medium text-ink'
                        : 'text-body sm:text-body-lg text-ink-muted'
                    }`}
                  >
                    {explainSimply && simpleExplanation ? (
                      <span>{simpleExplanation.simpleSummary}</span>
                    ) : analysis.verdict === 'scam' ? (
                      `Our pure deterministic engine identified ${analysis.signals.length} serious threat indicators with a composite risk score of ${analysis.score}/100. High probability of fraud.`
                    ) : analysis.verdict === 'suspicious' ? (
                      `Identified ${analysis.signals.length} cautionary patterns. Exercise vigilance and independently confirm before taking action.`
                    ) : (
                      'Evaluated against all 10 independent threat categories. Zero malicious trigger phrases detected, though caution is always recommended.'
                    )}
                  </CardDescription>

                  {/* Animated Risk Meter */}
                  <div className="pt-2 space-y-2">
                    <div className="flex items-center justify-between text-caption font-semibold text-ink">
                      <span>Risk Meter</span>
                      <span>
                        {analysis.verdict === 'scam'
                          ? 'High Danger Zone'
                          : analysis.verdict === 'suspicious'
                          ? 'Cautionary Zone'
                          : 'Clear Zone'}
                      </span>
                    </div>

                    <div
                      className="w-full bg-surface-subtle rounded-full h-4 sm:h-5 p-0.5 border border-border overflow-hidden relative"
                      role="progressbar"
                      aria-valuenow={animatedScore}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Risk Meter"
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-[600ms] ease-protective ${
                          analysis.verdict === 'scam'
                            ? 'bg-verdict-scam'
                            : analysis.verdict === 'suspicious'
                            ? 'bg-verdict-suspicious'
                            : 'bg-verdict-fine'
                        }`}
                        style={{ width: `${Math.max(4, animatedScore)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold text-ink-muted uppercase tracking-wider px-1">
                      <span>0 • Clear</span>
                      <span className="text-center">20 • Caution</span>
                      <span className="text-right">55+ • Scam</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* "Explain Simply" Mode: 3-Step "Do this / Don't do this" layout with 20px+ text */}
              {explainSimply && simpleExplanation && (
                <div className="space-y-4 animate-in fade-in duration-normal">
                  <div className="p-5 sm:p-6 rounded-card bg-primary-subtle border-2 border-primary/30 shadow-subtle space-y-2">
                    <div className="flex items-center gap-2.5">
                      <Sparkles size={24} className="text-primary shrink-0" aria-hidden="true" />
                      <h3 className="font-heading font-bold text-[22px] sm:text-[25px] text-ink">
                        {simpleExplanation.headline}
                      </h3>
                    </div>
                    <p className="text-[20px] sm:text-[22px] font-medium text-ink leading-relaxed">
                      {simpleExplanation.simpleSummary}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-heading-md sm:text-heading-lg text-ink">
                        3 Simple Rules for Right Now
                      </h3>
                      <span className="text-caption text-ink-muted">
                        Jargon-free safety instructions
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {simpleExplanation.steps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="p-5 sm:p-6 rounded-card bg-surface border-2 border-border shadow-subtle space-y-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-full bg-primary text-white font-bold text-body-lg flex items-center justify-center shrink-0 shadow-subtle">
                              {step.stepNumber}
                            </span>
                            <h4 className="font-heading font-bold text-[22px] sm:text-[24px] text-ink">
                              {step.title}
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Don't do this */}
                            <div className="p-4 sm:p-5 rounded-card-sm bg-verdict-scam-subtle/80 border-2 border-verdict-scam-border space-y-2">
                              <span className="font-bold text-caption uppercase text-verdict-scam-text flex items-center gap-1.5">
                                <span className="text-lg" aria-hidden="true">❌</span> Don't do this
                              </span>
                              <p className="text-[20px] sm:text-[21px] font-medium text-verdict-scam-text leading-snug">
                                {step.dontDoThis}
                              </p>
                            </div>

                            {/* Do this instead */}
                            <div className="p-4 sm:p-5 rounded-card-sm bg-verdict-fine-subtle/80 border-2 border-verdict-fine-border space-y-2">
                              <span className="font-bold text-caption uppercase text-verdict-fine-text flex items-center gap-1.5">
                                <span className="text-lg" aria-hidden="true">✅</span> Do this instead
                              </span>
                              <p className="text-[20px] sm:text-[21px] font-medium text-verdict-fine-text leading-snug">
                                {step.doThis}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. "What we noticed" Card */}
              <Card variant="default" radius="md" className="space-y-4 shadow-card">
                <div>
                  <h3 className="font-heading font-bold text-heading-md sm:text-heading-lg text-ink">
                    What we noticed
                  </h3>
                  <p className="text-body-sm text-ink-muted mt-1">
                    Tap or hover on any highlighted phrase below to view the plain-English explanation.
                  </p>
                </div>

                {/* Highlighted text container */}
                <div className="p-4 sm:p-5 rounded-card-sm bg-surface-subtle border border-border leading-relaxed text-body sm:text-body-lg text-ink whitespace-pre-wrap select-text break-words">
                  {renderWhatWeNoticed()}
                </div>

                {/* Underline Style & Severity Legend */}
                <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-ink-muted">
                  <span className="font-semibold text-ink">Underline Key:</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 border-b-2 border-verdict-scam underline decoration-verdict-scam decoration-wavy" aria-hidden="true" />
                    <span>Critical (Wavy)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 border-b-2 border-verdict-scam" aria-hidden="true" />
                    <span>High (Solid)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 border-b-2 border-dashed border-verdict-suspicious" aria-hidden="true" />
                    <span>Medium (Dashed)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 border-b-2 border-dotted border-ink-muted" aria-hidden="true" />
                    <span>Low (Dotted)</span>
                  </span>
                </div>
              </Card>

              {/* 3. Signals list: sorted by severity */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-heading-md sm:text-heading-lg text-ink">
                    Signals Identified ({sortedSignals.length})
                  </h3>
                  <span className="text-caption text-ink-muted">
                    Sorted by threat severity
                  </span>
                </div>

                {sortedSignals.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3.5">
                    {sortedSignals.map((signal) => (
                      <div
                        key={signal.id}
                        className="p-4 sm:p-5 rounded-card-sm bg-surface border border-border shadow-subtle flex items-start gap-3.5 sm:gap-4 transition-all"
                      >
                        <div
                          className="w-10 h-10 rounded-xl bg-surface-subtle border border-border flex items-center justify-center shrink-0 mt-0.5"
                          aria-hidden="true"
                        >
                          {getSignalIcon(signal.id)}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="font-heading font-semibold text-body-lg text-ink">
                              {signal.label}
                            </span>
                            <Badge
                              size="sm"
                              variant={
                                signal.severity === 'critical' || signal.severity === 'high'
                                  ? 'scam'
                                  : 'suspicious'
                              }
                            >
                              {signal.severity} severity
                            </Badge>
                          </div>

                          <p className="text-body text-ink leading-relaxed">
                            <strong className="text-ink-muted font-medium">Why this matters: </strong>
                            {explainSimply
                              ? signal.why.replace(/cryptocurrency/gi, 'digital coins').replace(/unsolicited/gi, 'unexpected')
                              : signal.why}
                          </p>

                          {signal.matches.length > 0 && (
                            <div className="pt-1 text-caption text-ink-muted">
                              <span>Triggered by: </span>
                              <span className="font-semibold text-ink bg-surface-subtle px-2 py-0.5 rounded border border-border-subtle inline-block break-words">
                                “{signal.matches[0].text}”
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 rounded-card-sm bg-surface border border-border shadow-subtle flex items-center gap-3.5">
                    <ShieldCheck size={28} className="text-verdict-fine shrink-0" aria-hidden="true" />
                    <div>
                      <h4 className="font-semibold text-body text-ink">
                        No Malicious Signals Detected
                      </h4>
                      <p className="text-caption text-ink-muted">
                        All 10 threat detectors returned clean. No high-risk keywords, deceptive URLs, or fee demands matched.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. "What to do now": numbered checklist with large readable text */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-heading-md sm:text-heading-lg text-ink">
                    What to do now
                  </h3>
                  <span className="text-caption text-ink-muted">
                    Follow these {analysis.nextSteps.length} simple steps
                  </span>
                </div>

                <ol className="space-y-3">
                  {analysis.nextSteps.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3.5 sm:gap-4 p-4 rounded-card-sm bg-surface border border-border shadow-subtle"
                    >
                      <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-body flex items-center justify-center shrink-0 border border-primary/20">
                        {idx + 1}
                      </span>
                      <span className="text-body sm:text-body-lg text-ink font-medium leading-relaxed pt-0.5">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* 5. Buttons: "Check another message", "Explain simply", "Create warning card" */}
              <div className="p-5 rounded-card bg-surface border border-border shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCheckAnother}
                  leftIcon={<RotateCcw size={18} />}
                  className="min-h-[48px] w-full sm:w-auto font-semibold active:scale-[0.98]"
                >
                  Check another message
                </Button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <Button
                    variant={explainSimply ? 'primary' : 'secondary'}
                    size="md"
                    onClick={() => setExplainSimply((v) => !v)}
                    leftIcon={
                      <Sparkles
                        size={18}
                        className={explainSimply ? 'text-white' : 'text-primary'}
                      />
                    }
                    className="min-h-[48px] w-full sm:w-auto font-medium active:scale-[0.98]"
                  >
                    {explainSimply ? 'Explain simply: ON' : 'Explain simply'}
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setShowWarningCardModal(true)}
                    leftIcon={<Share2 size={18} />}
                    className="min-h-[48px] w-full sm:w-auto font-medium active:scale-[0.98]"
                  >
                    Create warning card
                  </Button>
                </div>
              </div>

              {/* 6. Honest Note: "Scam Shield spots warning signs. It can't guarantee a message is safe." */}
              <div className="p-3.5 sm:p-4 rounded-card-sm bg-surface-subtle/80 border border-border-subtle flex items-center justify-center gap-2 text-caption text-ink-muted text-center">
                <AlertCircle size={15} className="text-ink-dim shrink-0" aria-hidden="true" />
                <p className="font-medium">
                  Scam Shield spots warning signs. It can't guarantee a message is safe.
                </p>
              </div>
            </section>
          )}

          {/* "How It Works" Section: 3 Clear Steps */}
          <section aria-labelledby="how-it-works-heading" className="mt-14 pt-10 border-t border-border-subtle">
            <div className="text-center mb-8">
              <h2 id="how-it-works-heading" className="font-heading font-bold text-heading-lg text-ink">
                How Scam Shield Works
              </h2>
              <p className="text-body text-ink-muted mt-1 max-w-lg mx-auto">
                Three simple, private steps to protect yourself and your family from fraud.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-card bg-surface border border-border shadow-subtle space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-bold text-body-lg">
                  <ClipboardPaste size={24} aria-hidden="true" />
                </div>
                <h3 className="font-heading font-bold text-heading-md text-ink">
                  1. Paste Any Message
                </h3>
                <p className="text-body-sm text-ink-muted leading-relaxed">
                  Copy unexpected SMS messages, WhatsApp forwards, bank alerts, or job offers and paste them into the box above.
                </p>
              </div>

              <div className="p-6 rounded-card bg-surface border border-border shadow-subtle space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-bold text-body-lg">
                  <Zap size={24} aria-hidden="true" />
                </div>
                <h3 className="font-heading font-bold text-heading-md text-ink">
                  2. Local Rule Inspection
                </h3>
                <p className="text-body-sm text-ink-muted leading-relaxed">
                  Our pure TypeScript engine evaluates the text locally in milliseconds across 10 deterministic fraud signal categories.
                </p>
              </div>

              <div className="p-6 rounded-card bg-surface border border-border shadow-subtle space-y-3">
                <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary flex items-center justify-center font-bold text-body-lg">
                  <CheckCircle2 size={24} aria-hidden="true" />
                </div>
                <h3 className="font-heading font-bold text-heading-md text-ink">
                  3. Actionable Clarity
                </h3>
                <p className="text-body-sm text-ink-muted leading-relaxed">
                  Get a plain-English verdict, highlighted trigger phrases, clear safety steps, and shareable warning cards.
                </p>
              </div>
            </div>
          </section>

          {/* Short Privacy Explanation */}
          <section
            aria-labelledby="privacy-explanation-heading"
            className="mt-8 p-6 sm:p-7 rounded-card bg-surface border border-border shadow-subtle flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
              <Lock size={24} aria-hidden="true" />
            </div>
            <div className="space-y-1 flex-1">
              <h2 id="privacy-explanation-heading" className="font-heading font-bold text-heading-md text-ink">
                Privacy Guarantee: 100% On-Device
              </h2>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                Your messages never leave your phone or computer. All pattern matching runs entirely in your browser using local TypeScript rules. There are no tracking cookies, no accounts, no server logs, and no remote AI APIs reading your private texts.
              </p>
            </div>
          </section>

          {/* Trust row with 3 short items: Private by design, Works offline, Free and open source */}
          <div className="mt-12 pt-8 border-t border-border-subtle">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Item 1: Private by design */}
              <div className="p-5 rounded-card-sm bg-surface border border-border shadow-subtle flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                  <Lock size={20} className="text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-body text-ink mb-1">
                    Private by design
                  </h3>
                  <p className="text-caption text-ink-muted leading-relaxed">
                    Analyzed 100% on your device. Nothing leaves your phone or browser. Zero data collected.
                  </p>
                </div>
              </div>

              {/* Item 2: Works offline */}
              <div className="p-5 rounded-card-sm bg-surface border border-border shadow-subtle flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                  <WifiOff size={20} className="text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-body text-ink mb-1">
                    Works offline
                  </h3>
                  <p className="text-caption text-ink-muted leading-relaxed">
                    No internet connection or server calls needed. Pure deterministic rule engine in JavaScript.
                  </p>
                </div>
              </div>

              {/* Item 3: Free and open source */}
              <div className="p-5 rounded-card-sm bg-surface border border-border shadow-subtle flex flex-col items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary flex items-center justify-center shrink-0">
                  <HeartHandshake size={20} className="text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-body text-ink mb-1">
                    Free and open source
                  </h3>
                  <p className="text-caption text-ink-muted leading-relaxed">
                    Built for everyday safety under the MIT license. No subscriptions, ads, or paywalls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Shareable 1080x1350 Warning Card Modal */}
      {analysis && (
        <WarningCardModal
          isOpen={showWarningCardModal}
          onClose={() => setShowWarningCardModal(false)}
          messageText={messageText}
          analysis={analysis}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-surface-subtle py-8">
        <div className="max-w-shield mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-caption text-ink-muted">
          <p>© Scam Shield. Open-source under MIT License.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('/design')}
              className="hover:text-primary transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 min-h-[44px] flex items-center"
            >
              Design System (/design)
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-primary">
              <Lock size={12} aria-hidden="true" /> Privacy Guaranteed
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
