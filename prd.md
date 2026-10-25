# Product Requirements Document (PRD): Scam Shield

## 1. Product Overview
Scam Shield is an accessible, privacy-centric web tool designed to instantly detect deceptive patterns in unsolicited communications (SMS, WhatsApp, emails, job offers) and provide actionable next steps.

## 2. Core Journey
1. **Landing & Input**:
   - The user visits the app on mobile or desktop.
   - The user pastes an untrusted message or taps one of 6 curated sample chips spanning all verdicts.
2. **Analysis & Verdict**:
   - The user taps "Check this message".
   - The engine evaluates the text locally in milliseconds.
   - The UI smoothly scrolls to the results view and announces the verdict via `aria-live`.
3. **Review & Action**:
   - The user reviews the large verdict card and animated risk meter (0–100).
   - The user inspects highlighted trigger phrases in "What we noticed" with interactive tooltips.
   - The user reads the prioritized "What to do now" checklist.
4. **Family Sharing & Simplified Mode**:
   - The user can toggle "Explain simply" mode for a jargon-free 3-step "Do this / Don't do this" layout.
   - The user can click "Create warning card" to download or copy a 1080×1350 image to share in family chats, keeping personal message text hidden by default.

## 3. Look and Feel
- Calm, protective visual language with a warm neutral background, deep teal primary actions, and distinct scam/suspicious/fine colors.
- Fraunces display headings and Inter body text, with responsive sizing and generous spacing for readability.
- Mobile-first layout, visible keyboard focus, reduced-motion support, and plain, non-alarmist safety copy.

## 4. Detailed Functional Requirements
### F1: Local Inspection Engine
- Detects 10 threat signals: `sensitive_info`, `remote_access`, `suspicious_links`, `money_request`, `threats`, `urgency`, `too_good_to_be_true`, `unsolicited_kyc`, `impersonation`, and `off_platform`.
- Evaluates compound risk multipliers (e.g. threats + links, urgency + OTP request).
- Categorizes messages into three verdicts:
  - `scam` (score ≥ 55): "This looks like a scam"
  - `suspicious` (score 20–54): "Be careful with this one"
  - `fine` (score < 20): "Looks okay, but verify"
- Enforces a 5,000-character input safety cap in the text field, paste/example flows, and analysis engine to limit ReDoS and excess work.

### F2: Highlighting & Tooltips
- Highlights exact trigger spans in the original text with color and underline styles:
  - Critical: Wavy underline
  - High: Solid underline
  - Medium: Dashed underline
  - Low: Dotted underline
- Clicking or hovering any highlight displays a tooltip with the plain-English rationale.

### F3: "Explain simply" Mode
- 20px+ accessible text with short, jargon-free sentences.
- 3-step layout containing explicit "❌ Don't do this" and "✅ Do this instead" pairs.

### F4: Shareable Warning Card
- Renders at 1080×1350 PNG format using `html-to-image`.
- Displays verdict, top 2–3 reasons, and the required rule: *"Don't click. Don't share OTPs. Check with the official number."*
- Omits the original message text by default; includes it only when the user checks "Include message text on the card".
- Provides "Download Image (PNG)" and "Copy to Clipboard" buttons.

## 5. Non-Functional & Safety Constraints
- **Privacy**: No external network requests (`fetch`, XHR, WebSocket), zero analytics, zero cookies.
- **Safety**: Disclaimer: *"Scam Shield spots warning signs. It can't guarantee a message is safe."*
- **Accessibility**: WCAG 2.2 AA compliant, visible focus rings, 44px minimum touch targets, prefers-reduced-motion support.
- **Intellectual Property**: Fictional brands only ("Example Bank", "QuickParcel", etc.). Zero real trademarks or logos.
- **Verification**: Vitest covers the local engine, fixture benchmarks, input cap, CSP presence, absence of dangerous HTML and network APIs, and share-card message privacy. CI runs `npm ci`, `npm test`, and `npm run build`.
