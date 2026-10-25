# Project Scope: Scam Shield

## 1. Problem Statement
Every day, millions of people—especially older adults and first-time smartphone users—receive deceptive SMS, WhatsApp, and email messages claiming their bank account is blocked, a parcel is held at customs, or an unclaimed refund is waiting. Many fall victim because they lack an immediate, safe way to verify messages without giving away their private data.

## 2. Core Idea & Solution
Scam Shield is a privacy-first web application that evaluates suspicious messages in seconds. It operates 100% on-device using a pure deterministic TypeScript rule engine, with zero cloud AI calls, zero network tracking, and zero API keys.

## 3. Inspiration & Identity
- Calm, protective, and easy to read rather than alarmist or technical.
- Warm neutral surfaces, protective teal, and clear verdict colors; Fraunces headings pair with Inter body text.
- Mobile-first layouts, comfortable spacing, large controls, and clear contrast support older adults and first-time smartphone users.

## 4. Scope Boundaries (Proof of Concept)
### In Scope
- Single-page responsive web app (mobile-first, desktop-optimized).
- Pure client-side deterministic rule engine inspecting 10 threat categories.
- Compound risk scoring (0–100) with 3 clear verdicts: Scam, Suspicious, Fine.
- Interactive message preview with highlighted trigger phrases and plain-English tooltips.
- "Explain simply" mode with 20px+ text, short sentences, and a 3-step "Do this / Don't do this" layout.
- High-resolution 1080×1350 PNG shareable warning cards with privacy opt-in for personal text.
- Comprehensive benchmark test suite with 24 realistic fixtures (fictional brands only) running under Vitest.

### Out of Scope
- Backend servers, user authentication, or persistent database storage.
- External cloud AI APIs (LLMs) or remote heuristic services.
- Real-time SMS interception or native mobile OS notification listeners.
- Real trademarked brand logos or automated trademark scraping.

## 5. Target Audience
- Everyday smartphone users.
- Older family members and beginners who need large, accessible, jargon-free safety advice.
- Digital literacy educators seeking transparent, offline demonstration tools.

## 6. Success Criteria
- 100% precision on the 24 benchmark fixtures with zero false positives on legitimate messages.
- Under 50ms deterministic local analysis for a 5,000-character adversarial input.
- WCAG 2.2 AA accessibility compliance with full keyboard navigation and screen-reader support.
