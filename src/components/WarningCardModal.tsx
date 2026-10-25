import React, { useState, useEffect, useRef } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { AnalysisResult, Severity } from '../engine/types';
import { Button } from './Button';
import {
  DEFAULT_INCLUDE_MESSAGE,
  getShareCardMessage,
} from './shareCardPrivacy';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Download,
  Copy,
  Check,
  X,
  Lock,
  ExternalLink,
  KeyRound,
  CreditCard,
  Clock,
  AlertOctagon,
  Laptop,
  Gift,
  FileText,
  Building2,
  MessageSquare,
} from 'lucide-react';

export interface WarningCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageText: string;
  analysis: AnalysisResult;
}

export const WarningCardModal: React.FC<WarningCardModalProps> = ({
  isOpen,
  onClose,
  messageText,
  analysis,
}) => {
  const [includeMessage, setIncludeMessage] = useState(DEFAULT_INCLUDE_MESSAGE);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Hidden 1080x1350 canvas reference for high-res export
  const exportCardRef = useRef<HTMLDivElement>(null);
  const shareCardMessage = getShareCardMessage(messageText, includeMessage);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Plain-language reasons from top 2-3 signals
  const SEVERITY_ORDER: Record<Severity, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const topSignals = [...analysis.signals]
    .sort((a, b) => {
      const diff = SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];
      if (diff !== 0) return diff;
      return b.weight - a.weight;
    })
    .slice(0, 3);

  const getSimpleReason = (id: string, defaultWhy: string): string => {
    switch (id) {
      case 'sensitive_info':
        return 'Asks you to share secret OTP codes, bank PINs, or card details.';
      case 'remote_access':
        return 'Tells you to install screen-sharing software (like AnyDesk) to take control.';
      case 'suspicious_links':
        return 'Contains a fake, deceptive, or shortened web link to steal logins.';
      case 'money_request':
        return 'Asks for upfront fees, deposits, gift cards, or crypto transfers.';
      case 'threats':
        return 'Threatens immediate account suspension, police arrest, or power shutoff.';
      case 'urgency':
        return 'Pressures you to act hastily within hours before you have time to verify.';
      case 'too_good_to_be_true':
        return 'Promises unrealistic prize money, luxury gifts, or effortless high income.';
      case 'unsolicited_kyc':
        return 'Demands urgent biometric or identity card upload (Aadhaar, PAN, KYC).';
      case 'impersonation':
        return 'Pretends to be a recognized bank, courier, or government department.';
      case 'off_platform':
        return 'Directs you away to private unmonitored Telegram or WhatsApp chats.';
      default:
        return defaultWhy;
    }
  };

  const getReasonIcon = (id: string) => {
    switch (id) {
      case 'sensitive_info':
        return <KeyRound size={28} className="text-red-400 shrink-0" />;
      case 'remote_access':
        return <Laptop size={28} className="text-red-400 shrink-0" />;
      case 'suspicious_links':
        return <ExternalLink size={28} className="text-red-400 shrink-0" />;
      case 'money_request':
        return <CreditCard size={28} className="text-red-400 shrink-0" />;
      case 'threats':
        return <AlertOctagon size={28} className="text-red-400 shrink-0" />;
      case 'urgency':
        return <Clock size={28} className="text-amber-400 shrink-0" />;
      case 'too_good_to_be_true':
        return <Gift size={28} className="text-amber-400 shrink-0" />;
      case 'unsolicited_kyc':
        return <FileText size={28} className="text-red-400 shrink-0" />;
      case 'impersonation':
        return <Building2 size={28} className="text-amber-400 shrink-0" />;
      case 'off_platform':
        return <MessageSquare size={28} className="text-amber-400 shrink-0" />;
      default:
        return <AlertTriangle size={28} className="text-amber-400 shrink-0" />;
    }
  };

  const verdictTitle =
    analysis.verdict === 'scam'
      ? 'THIS LOOKS LIKE A SCAM'
      : analysis.verdict === 'suspicious'
      ? 'BE CAREFUL WITH THIS ONE'
      : 'LOOKS OKAY, BUT VERIFY';

  const verdictSubtitle =
    analysis.verdict === 'scam'
      ? 'Multiple confirmed fraud signals detected. Do not reply or send money.'
      : analysis.verdict === 'suspicious'
      ? 'Warning patterns found. Verify through official channels before acting.'
      : 'No known trick phrases found. Keep passwords and codes private.';

  const handleDownloadImage = async () => {
    if (!exportCardRef.current) return;
    try {
      setIsExporting(true);
      setStatusMessage('Rendering 1080x1350 image...');

      // Small delay to ensure all fonts and DOM styles are settled
      await new Promise((res) => setTimeout(res, 80));

      const dataUrl = await toPng(exportCardRef.current, {
        width: 1080,
        height: 1350,
        pixelRatio: 1,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `scam-shield-warning-${analysis.verdict}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setStatusMessage('Downloaded PNG image!');
      setTimeout(() => {
        setDownloadSuccess(false);
        setStatusMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to render image:', err);
      setStatusMessage('Could not generate image. Please try copying text.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!exportCardRef.current) return;
    try {
      setIsExporting(true);
      setStatusMessage('Copying card image to clipboard...');

      await new Promise((res) => setTimeout(res, 80));

      // Attempt to copy image blob directly to clipboard
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        const blob = await toBlob(exportCardRef.current, {
          width: 1080,
          height: 1350,
          pixelRatio: 1,
          cacheBust: true,
        });

        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopySuccess(true);
          setStatusMessage('Image copied to clipboard! Paste into WhatsApp or messages.');
          setTimeout(() => {
            setCopySuccess(false);
            setStatusMessage(null);
          }, 3500);
          return;
        }
      }

      // Fallback: Copy clean text if image clipboard is unsupported
      const reasonsText = topSignals
        .map((s, i) => `${i + 1}. ${s.label}: ${getSimpleReason(s.id, s.why)}`)
        .join('\n');

      const shareText = `🛡️ SCAM SHIELD WARNING CARD
VERDICT: ${verdictTitle} (Score: ${analysis.score}/100)

${reasonsText}

⚠️ GOLDEN RULE:
Don't click. Don't share OTPs. Check with the official number.

Checked with Scam Shield (100% on-device)`;

      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setStatusMessage('Warning text copied to clipboard!');
      setTimeout(() => {
        setCopySuccess(false);
        setStatusMessage(null);
      }, 3500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
      setStatusMessage('Could not copy automatically. Tap Download instead.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="warning-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-fast overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-surface border border-border rounded-card-lg shadow-elevated p-5 sm:p-7 relative my-auto animate-in zoom-in-95 duration-fast space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h2 className="font-heading font-bold text-heading-md sm:text-heading-lg text-ink" id="warning-modal-title">
              Create Warning Card
            </h2>
            <p className="text-caption text-ink-muted">
              Generate a 1080x1350 image to share in family group chats.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Privacy Checkbox (Default OFF) */}
        <div className="p-3.5 rounded-card-sm bg-surface-subtle border border-border flex items-center justify-between gap-3">
          <label
            htmlFor="include-message-toggle"
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <input
              id="include-message-toggle"
              type="checkbox"
              checked={includeMessage}
              onChange={(e) => setIncludeMessage(e.target.checked)}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-1 transition-all cursor-pointer"
            />
            <div>
              <span className="font-semibold text-body-sm text-ink block">
                Include message text on the card
              </span>
              <span className="text-caption text-ink-muted block">
                Default is off so no personal or phone details are shared in group chats.
              </span>
            </div>
          </label>
        </div>

        {/* Scaled Preview Box */}
        <div className="relative bg-[#0B1015] rounded-card border border-border p-3 overflow-hidden flex flex-col items-center justify-center shadow-inner min-h-[320px]">
          <span className="text-[12px] font-semibold text-ink-dim uppercase tracking-wider mb-2">
            Card Preview (1080 × 1350 Aspect Ratio)
          </span>

          {/* Scaled visual representation */}
          <div className="w-[240px] sm:w-[270px] h-[300px] sm:h-[337px] rounded-card-sm border border-border/60 bg-[#101721] p-3 sm:p-4 flex flex-col justify-between text-white shadow-card pointer-events-none select-none overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-emerald-400" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-white/90">
                  SCAM SHIELD ALERT
                </span>
              </div>
              <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-white/80">
                100% on-device
              </span>
            </div>

            {/* Verdict */}
            <div
              className={`p-2.5 rounded-md text-center border ${
                analysis.verdict === 'scam'
                  ? 'bg-red-950/70 border-red-500/50 text-red-200'
                  : analysis.verdict === 'suspicious'
                  ? 'bg-amber-950/70 border-amber-500/50 text-amber-200'
                  : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                Risk Score: {analysis.score}/100
              </span>
              <h4 className="text-[13px] font-extrabold leading-tight">
                {verdictTitle}
              </h4>
            </div>

            {/* Reasons */}
            <div className="space-y-1 text-[10px] text-white/85">
              <span className="text-[9px] font-bold uppercase text-white/50 block">
                Top Reasons:
              </span>
              {topSignals.length > 0 ? (
                topSignals.slice(0, 2).map((sig) => (
                  <p key={sig.id} className="leading-tight flex items-start gap-1">
                    <span className="text-red-400 shrink-0">•</span>
                    <span>{getSimpleReason(sig.id, sig.why).slice(0, 50)}...</span>
                  </p>
                ))
              ) : (
                <p className="leading-tight text-white/80">
                  • No common scam trick words found in this message.
                </p>
              )}
            </div>

            {/* Optional text snippet */}
            {shareCardMessage !== null && (
              <div className="p-1.5 rounded bg-black/40 border border-white/10 text-[9px] text-white/75 italic truncate">
                "{shareCardMessage.slice(0, 60)}..."
              </div>
            )}

            {/* Golden Rule Line */}
            <div className="p-2 rounded bg-emerald-950/80 border border-emerald-500/40 text-center text-[10px] font-bold text-emerald-200 leading-tight">
              Don't click. Don't share OTPs. Check with the official number.
            </div>

            {/* Footer */}
            <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[8px] text-white/50">
              <span>Checked with Scam Shield</span>
              <span>Private by design</span>
            </div>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            role="status"
            className="p-3 rounded-card-sm bg-primary-subtle text-primary border border-primary/20 text-body-sm font-medium text-center animate-in fade-in duration-fast"
          >
            {statusMessage}
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={onClose}
            className="min-h-[44px]"
          >
            Close
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={handleCopyToClipboard}
            isLoading={isExporting && !downloadSuccess}
            leftIcon={copySuccess ? <Check size={18} /> : <Copy size={18} />}
            className="min-h-[44px]"
          >
            {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleDownloadImage}
            isLoading={isExporting && !copySuccess}
            leftIcon={downloadSuccess ? <Check size={18} /> : <Download size={18} />}
            className="min-h-[44px] shadow-card font-semibold"
          >
            {downloadSuccess ? 'Downloaded!' : 'Download Image (PNG)'}
          </Button>
        </div>
      </div>

      {/* OFF-SCREEN EXACT 1080x1350 HIGH-RESOLUTION EXPORT NODE */}
      <div
        className="fixed left-[-9999px] top-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          ref={exportCardRef}
          style={{
            width: '1080px',
            height: '1350px',
            boxSizing: 'border-box',
          }}
          className="bg-[#0F1722] text-[#F3F4F6] p-14 flex flex-col justify-between font-sans relative overflow-hidden select-none"
        >
          {/* Top Decorative Header */}
          <div className="flex items-center justify-between pb-8 border-b-2 border-white/15">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-700/80 text-white flex items-center justify-center shadow-lg">
                <Shield size={38} className="text-emerald-100" />
              </div>
              <div>
                <span className="font-serif font-black text-4xl text-white tracking-wide block">
                  SCAM SHIELD
                </span>
                <span className="text-xl font-medium text-emerald-300">
                  Security Warning Notice
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-xl font-medium text-white/90">
              <Lock size={20} className="text-emerald-400" />
              <span>100% On-Device Verification</span>
            </div>
          </div>

          {/* Large Hero Verdict Card */}
          <div
            className={`p-10 rounded-3xl border-4 shadow-2xl flex items-center gap-8 ${
              analysis.verdict === 'scam'
                ? 'bg-[#291215] border-[#EF4444] text-[#FEE2E2]'
                : analysis.verdict === 'suspicious'
                ? 'bg-[#291D0E] border-[#F59E0B] text-[#FEF3C7]'
                : 'bg-[#0E281C] border-[#10B981] text-[#D1FAE5]'
            }`}
          >
            <div className="shrink-0" aria-hidden="true">
              {analysis.verdict === 'scam' ? (
                <div className="w-28 h-28 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xl">
                  <ShieldAlert size={68} />
                </div>
              ) : analysis.verdict === 'suspicious' ? (
                <div className="w-28 h-28 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-xl">
                  <AlertTriangle size={68} />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xl">
                  <ShieldCheck size={68} />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-black/40 border border-white/20">
                  {analysis.verdict === 'scam'
                    ? 'CRITICAL ALERT'
                    : analysis.verdict === 'suspicious'
                    ? 'CAUTION REQUIRED'
                    : 'VERIFIED CLEAR'}
                </span>
                <span className="text-3xl font-black text-white">
                  Risk Score: {analysis.score}/100
                </span>
              </div>

              <h1 className="font-serif font-black text-5xl leading-tight tracking-tight">
                {verdictTitle}
              </h1>

              <p className="text-2xl font-medium opacity-90 leading-relaxed">
                {verdictSubtitle}
              </p>
            </div>
          </div>

          {/* Optional Message Snippet (Only when explicitly enabled by user) */}
          {shareCardMessage !== null && (
            <div className="p-7 rounded-2xl bg-white/5 border-2 border-white/10 space-y-2">
              <span className="text-lg font-bold uppercase tracking-wider text-white/50 block">
                Inspected Message:
              </span>
              <p className="text-2xl text-white/90 italic leading-relaxed line-clamp-3">
                "{shareCardMessage.length > 220
                  ? `${shareCardMessage.slice(0, 220)}...`
                  : shareCardMessage}"
              </p>
            </div>
          )}

          {/* Top 2-3 Reasons in Simple Words */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-wider text-white/60">
              Why this was flagged:
            </h2>

            <div className="space-y-4">
              {topSignals.length > 0 ? (
                topSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className="p-6 rounded-2xl bg-[#172230] border-2 border-white/15 flex items-start gap-5 shadow-md"
                  >
                    <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                      {getReasonIcon(signal.id)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">
                          {signal.label}
                        </span>
                        <span className="text-lg font-semibold uppercase px-3 py-1 rounded bg-black/30 border border-white/10 text-white/70">
                          {signal.severity}
                        </span>
                      </div>
                      <p className="text-2xl text-white/85 font-medium mt-1 leading-relaxed">
                        {getSimpleReason(signal.id, signal.why)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-[#172230] border-2 border-white/15 flex items-center gap-5">
                  <ShieldCheck size={36} className="text-emerald-400 shrink-0" />
                  <p className="text-2xl text-white/90 font-medium">
                    No deceptive keywords, fake links, or fee demands were detected in this message.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Prominent Required Golden Rule Box */}
          <div className="p-8 rounded-3xl bg-[#092B28] border-4 border-[#14958A] shadow-2xl text-center space-y-2">
            <span className="text-xl font-black uppercase tracking-widest text-emerald-300 block">
              SAFETY RULE FOR FAMILY & FRIENDS
            </span>
            <p className="font-serif font-black text-4xl text-white leading-snug">
              Don't click. Don't share OTPs. Check with the official number.
            </p>
          </div>

          {/* Small Honest Footer */}
          <div className="pt-6 border-t-2 border-white/15 flex items-center justify-between text-xl text-white/60">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-emerald-400" />
              <span className="font-semibold text-white">Checked with Scam Shield</span>
              <span>•</span>
              <span>Zero personal data leaves your device</span>
            </div>
            <span>Open Source under MIT License</span>
          </div>
        </div>
      </div>
    </div>
  );
};
