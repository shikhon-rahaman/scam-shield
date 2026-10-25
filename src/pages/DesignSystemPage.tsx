import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Tooltip,
  Toggle,
  Section,
} from '../components';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Lock,
  Download,
  Share2,
  Sparkles,
  HelpCircle,
  Eye,
} from 'lucide-react';

export const DesignSystemPage: React.FC = () => {
  const [explainSimply, setExplainSimply] = useState(false);
  const [notificationToggle, setNotificationToggle] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-ink py-10 transition-colors duration-normal">
      {/* Top Banner / Navigation back */}
      <div className="max-w-shield mx-auto px-4 sm:px-6 mb-8 flex items-center justify-between">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline text-body"
        >
          <ArrowRight className="rotate-180" size={20} /> Back to Scam Shield App
        </a>
        <Badge variant="primary" size="sm">
          Design System & Spec Review
        </Badge>
      </div>

      {/* Header Section */}
      <Section
        title="Scam Shield Design System"
        subtitle="A calm, protective, and trustworthy visual language designed for clarity, safety, and high accessibility. Built mobile-first with an 8px grid and max 720px width."
        badge={
          <div className="flex items-center gap-2 text-primary font-heading font-semibold text-caption tracking-wider uppercase">
            <Lock size={16} /> Privacy-First • No Backend
          </div>
        }
      >
        <Card variant="subtle" className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-caption text-ink-muted">Typography</p>
              <p className="font-heading font-semibold text-ink text-heading-md">Fraunces + Inter</p>
            </div>
            <div>
              <p className="text-caption text-ink-muted">Min Body Size</p>
              <p className="font-heading font-semibold text-ink text-heading-md">18px (Readable)</p>
            </div>
            <div>
              <p className="text-caption text-ink-muted">Spacing Base</p>
              <p className="font-heading font-semibold text-ink text-heading-md">8px Grid</p>
            </div>
            <div>
              <p className="text-caption text-ink-muted">Motion</p>
              <p className="font-heading font-semibold text-ink text-heading-md">150-250ms</p>
            </div>
          </div>
        </Card>
      </Section>

      {/* 1. Verdict System - Core Requirement */}
      <Section
        title="1. Verdict System"
        subtitle="Critical Rule: Verdict colors are NEVER shown alone. Every verdict is strictly paired with a clear SVG icon AND an explicit text label for universal accessibility."
      >
        <div className="space-y-4">
          <Card variant="verdict-scam" className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="scam" size="lg">
                Likely Scam
              </Badge>
              <span className="text-caption text-verdict-scam-text font-mono font-medium">
                #C62F2F (Red)
              </span>
            </div>
            <p className="text-body font-medium text-ink">
              High danger detection: Urgent payment demands, fake OTP alerts, or credential harvesting.
            </p>
          </Card>

          <Card variant="verdict-suspicious" className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="suspicious" size="lg">
                Suspicious
              </Badge>
              <span className="text-caption text-verdict-suspicious-text font-mono font-medium">
                #B7791F (Amber)
              </span>
            </div>
            <p className="text-body font-medium text-ink">
              Caution advised: Unverified short-links, artificial urgency, or unexpected delivery fee requests.
            </p>
          </Card>

          <Card variant="verdict-fine" className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="fine" size="lg">
                Probably Fine
              </Badge>
              <span className="text-caption text-verdict-fine-text font-mono font-medium">
                #2F7D4F (Green)
              </span>
            </div>
            <p className="text-body font-medium text-ink">
              No known red flags detected. Still reminds users never to share personal passwords or 2FA codes.
            </p>
          </Card>
        </div>
      </Section>

      {/* 2. Typography Scale */}
      <Section
        title="2. Typography Scale"
        subtitle="Fraunces provides warm editorial reassurance; Inter delivers crisp legibility even on low-resolution mobile screens."
      >
        <Card variant="default" className="space-y-6">
          <div className="border-b border-border pb-4">
            <p className="text-caption text-ink-muted mb-1">Display Large (56px) — Fraunces</p>
            <h1 className="text-display-lg font-heading text-ink">Scam Shield</h1>
          </div>

          <div className="border-b border-border pb-4">
            <p className="text-caption text-ink-muted mb-1">Display (44px) — Fraunces</p>
            <h2 className="text-display font-heading text-ink">Check any message in seconds</h2>
          </div>

          <div className="border-b border-border pb-4">
            <p className="text-caption text-ink-muted mb-1">Heading XL (36px) — Fraunces</p>
            <h3 className="text-heading-xl font-heading text-ink">What should you do next?</h3>
          </div>

          <div className="border-b border-border pb-4">
            <p className="text-caption text-ink-muted mb-1">Heading MD (22px) — Fraunces</p>
            <h4 className="text-heading-md font-heading text-ink">Why this triggered an alert</h4>
          </div>

          <div className="border-b border-border pb-4">
            <p className="text-caption text-ink-muted mb-1">Body Large (20px) — Inter</p>
            <p className="text-body-lg text-ink">
              This message claims your bank account is suspended and asks you to tap a suspicious link.
            </p>
          </div>

          <div>
            <p className="text-caption text-ink-muted mb-1">Body (18px Standard Minimum) — Inter</p>
            <p className="text-body text-ink">
              All scans happen completely inside your browser using deterministic rules. No text is ever uploaded or stored.
            </p>
          </div>
        </Card>
      </Section>

      {/* 3. Reusable Button Component */}
      <Section
        title="3. Button Component"
        subtitle="Designed with generous tap targets (48-56px min height), tactile feedback, and accessible focus outlines."
      >
        <Card variant="default" className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-body-lg font-semibold text-ink">Button Variants</h4>
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary" leftIcon={<ShieldCheck size={20} />}>
                Primary Check
              </Button>
              <Button variant="secondary" leftIcon={<Share2 size={20} />}>
                Share Warning
              </Button>
              <Button variant="outline" leftIcon={<Download size={20} />}>
                Download Card
              </Button>
              <Button variant="ghost">Cancel</Button>
              <Button variant="danger" leftIcon={<ShieldAlert size={20} />}>
                Block Sender
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <h4 className="text-body-lg font-semibold text-ink">Sizes & States</h4>
            <div className="flex flex-wrap gap-3 items-center">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight size={20} />}>
                Large CTA (56px)
              </Button>
              <Button size="md" variant="primary">
                Medium (48px)
              </Button>
              <Button size="sm" variant="secondary">
                Small (38px)
              </Button>
              <Button
                variant="primary"
                isLoading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 2000);
                }}
              >
                {btnLoading ? 'Analyzing...' : 'Click to test loading'}
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </Card>
      </Section>

      {/* 4. Badges */}
      <Section
        title="4. Badge Component"
        subtitle="Used for verdicts, status alerts, and feature labels with icons permanently attached."
      >
        <Card variant="default" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="scam" size="lg">Likely Scam (Large)</Badge>
            <Badge variant="suspicious" size="lg">Suspicious (Large)</Badge>
            <Badge variant="fine" size="lg">Probably Fine (Large)</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="scam" size="md">Likely Scam (Medium)</Badge>
            <Badge variant="suspicious" size="md">Suspicious (Medium)</Badge>
            <Badge variant="fine" size="md">Probably Fine (Medium)</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="scam" size="sm">Scam</Badge>
            <Badge variant="suspicious" size="sm">Suspicious</Badge>
            <Badge variant="fine" size="sm">Fine</Badge>
            <Badge variant="neutral" size="sm">SMS Message</Badge>
            <Badge variant="primary" size="sm">100% On-Device</Badge>
          </div>
        </Card>
      </Section>

      {/* 5. Cards & Soft Surfaces */}
      <Section
        title="5. Card Surfaces (16–24px Radius)"
        subtitle="Warm, approachable containers with subtle shadows and protective color treatments."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="default" radius="md">
            <CardHeader>
              <CardTitle>Standard Surface</CardTitle>
              <CardDescription>Default 20px radius with subtle border & shadow</CardDescription>
            </CardHeader>
            <CardContent>
              Perfect for form containers, message inputs, and action lists.
            </CardContent>
            <CardFooter>
              <span className="text-caption text-ink-muted">CardFooter slot with border-t</span>
            </CardFooter>
          </Card>

          <Card variant="elevated" radius="lg">
            <CardHeader>
              <CardTitle>Elevated Surface</CardTitle>
              <CardDescription>24px radius with deep soft shadow</CardDescription>
            </CardHeader>
            <CardContent>
              Ideal for verdict reveal dialogs and shareable cards.
            </CardContent>
            <CardFooter>
              <span className="text-caption text-primary font-medium flex items-center gap-1">
                <Sparkles size={16} /> Protective Elevation
              </span>
            </CardFooter>
          </Card>

          <Card variant="subtle" radius="sm">
            <CardTitle className="text-body-lg">Subtle Surface (16px)</CardTitle>
            <p className="text-body text-ink-muted mt-2">
              Used for supplementary information, disclaimer callouts, and hints.
            </p>
          </Card>

          <Card variant="default" radius="md" className="border-dashed border-2">
            <CardTitle className="text-body-lg">Dashed Input Area</CardTitle>
            <p className="text-body text-ink-muted mt-2">
              Provides an inviting drop or paste area for suspicious text.
            </p>
          </Card>
        </div>
      </Section>

      {/* 6. Toggle Component */}
      <Section
        title="6. Toggle Component"
        subtitle="High-contrast switch supporting simplified language modes and quick preferences."
      >
        <Card variant="default" className="space-y-6">
          <Toggle
            label="Explain Simply Mode"
            description="Replaces technical jargon with plain, direct explanations for elders and non-tech users."
            checked={explainSimply}
            onChange={setExplainSimply}
          />

          <div className="p-4 rounded-card-sm bg-surface-subtle border border-border-subtle">
            <div className="flex items-center gap-2 mb-1">
              <Eye size={18} className="text-primary" />
              <span className="font-semibold text-ink text-body">
                Previewing: {explainSimply ? 'Simple Mode' : 'Standard Mode'}
              </span>
            </div>
            <p className="text-body text-ink-muted">
              {explainSimply
                ? '“Someone is pretending to be your bank to steal your money. Do not press any buttons or reply.”'
                : '“Phishing indicator detected: Urgency trigger combined with credential harvesting domain spoofing.”'}
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <Toggle
              label="Highlight trigger phrases"
              description="Visual markers on the exact words that caused the suspicion"
              checked={notificationToggle}
              onChange={setNotificationToggle}
            />
          </div>
        </Card>
      </Section>

      {/* 7. Tooltip Component */}
      <Section
        title="7. Tooltip Component"
        subtitle="Accessible contextual hints accessible by mouse hover or keyboard focus."
      >
        <Card variant="default" className="p-6">
          <p className="text-body text-ink mb-6">
            Hover or tab to the badges below to inspect explanations:
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Tooltip content="Rule #104: Demanding OTP or PIN via SMS is fraudulent." position="top">
              <Badge variant="scam" className="cursor-help">
                Trigger: "Send OTP code"
              </Badge>
            </Tooltip>

            <Tooltip content="Rule #201: Artificial rush used to bypass careful thinking." position="bottom">
              <Badge variant="suspicious" className="cursor-help">
                Trigger: "Within 24 hours"
              </Badge>
            </Tooltip>

            <Tooltip content="Your data never leaves this browser tab." position="right">
              <Button variant="outline" size="sm" leftIcon={<Lock size={16} />}>
                Privacy Guarantee
              </Button>
            </Tooltip>

            <Tooltip content="Need help? Click to read the plain English guide." position="left">
              <button
                type="button"
                className="p-2 text-ink-muted hover:text-ink rounded-full hover:bg-surface-subtle"
                aria-label="Help information"
              >
                <HelpCircle size={22} />
              </button>
            </Tooltip>
          </div>
        </Card>
      </Section>

      {/* 8. Color Palette Swatches */}
      <Section
        title="8. Protective Color Palette"
        subtitle="Tokens extracted from src/styles/tokens.css supporting automatic dark mode adaptation."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-card-sm border border-border bg-primary text-white">
            <p className="font-semibold text-body-lg">Primary Teal</p>
            <p className="text-caption opacity-90">#0F5C5C</p>
            <p className="text-caption mt-2 opacity-75">Trust & calm</p>
          </div>

          <div className="p-4 rounded-card-sm border border-border bg-bg text-ink">
            <p className="font-semibold text-body-lg">Off-White BG</p>
            <p className="text-caption text-ink-muted">#FAF8F4</p>
            <p className="text-caption mt-2 text-ink-muted">Warm, glare-free</p>
          </div>

          <div className="p-4 rounded-card-sm border border-border bg-surface text-ink shadow-subtle">
            <p className="font-semibold text-body-lg">Surface</p>
            <p className="text-caption text-ink-muted">#FFFFFF / #18222B</p>
            <p className="text-caption mt-2 text-ink-muted">Card containers</p>
          </div>

          <div className="p-4 rounded-card-sm border border-border bg-surface-subtle text-ink">
            <p className="font-semibold text-body-lg">Deep Ink Text</p>
            <p className="text-caption text-ink-muted">#16202A</p>
            <p className="text-caption mt-2 text-ink-muted">High contrast</p>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="max-w-shield mx-auto px-4 sm:px-6 pt-12 pb-8 border-t border-border mt-8 text-center text-caption text-ink-muted">
        <p>Scam Shield Design System • Designed for simplicity, clarity, and safety • Open-source MIT</p>
      </footer>
    </div>
  );
};
