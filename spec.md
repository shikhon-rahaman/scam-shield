---
doc: spec
status: draft
---

# Scam Shield — Technical Spec

## How This Works, In Plain Language

Scam Shield is a single-page app that runs in the visitor's browser. The message stays in the input box on that device. When the visitor checks it, a local TypeScript rule engine looks for ten kinds of warning signs and combines them into a score and a plain-language result. The page then shows the result, the phrases that triggered it, and practical next steps.

The optional warning card is also made in the browser. Its message-text setting starts off, so a card contains no personal message unless the visitor chooses to include it. There is no account, database, analysis server, or online detection service.

This shape fits the proof of concept: it demonstrates transparent local detection and sharing without introducing a backend or transmitting sensitive content.

## The Core Journey Through the System

Implements `prd.md > Core Journey`.

1. The visitor opens the Vite-hosted page; `src/main.tsx` mounts the React app in `src/App.tsx`.
2. The visitor types, pastes, or selects a sample. The input is limited to 5,000 characters; app state keeps it only for the current page session.
3. On check, `src/engine/index.ts` scans the text with the ten local detectors, applies compound scoring and verdict thresholds, and builds next steps.
4. `src/App.tsx` renders the verdict and score, highlights exact matched phrases, and presents next steps. The optional simple explanation comes from `src/engine/explainSimply.ts`.
5. If the visitor chooses a warning card, `src/components/WarningCardModal.tsx` renders its preview and high-resolution export locally. `src/components/shareCardPrivacy.ts` supplies message text only after explicit opt-in. The browser downloads the PNG or copies it using clipboard APIs when supported.

```text
Message input (browser)
        |
        v
Local TypeScript detectors -> score + verdict + reasons + next steps
        |                                      |
        v                                      v
Highlighted results and simple explanation    Optional warning card
                                               (message excluded by default)
```

## Stack

- **TypeScript 5.6.3, React 18.3.1** — typed browser UI and local rule engine.
  - [TypeScript documentation](https://www.typescriptlang.org/docs/)
  - [React documentation](https://react.dev/learn)
- **Vite 6.4.5** — local development server and production bundler.
  - [Vite documentation](https://vite.dev/guide/)
- **Vitest 3.2.7 and @types/node 26.6.5** — unit, fixture, and filesystem-backed security-guardrail tests; Node types are development-only.
  - [Vitest documentation](https://vitest.dev/guide/)
  - [Node.js API documentation](https://nodejs.org/docs/latest/api/fs.html)
- **Tailwind CSS 3.4.17** — utility styling layered over CSS design tokens.
  - [Tailwind CSS v3 documentation](https://v3.tailwindcss.com/docs)
- **html-to-image 1.11.13** — renders the in-browser card to PNG/blob without a remote service.
  - [html-to-image documentation](https://github.com/bubkoo/html-to-image)
- **lucide-react 0.468.0** — locally bundled interface icons.
  - [Lucide React documentation](https://lucide.dev/guide/packages/lucide-react)
- **@fontsource/fraunces 5.1.1 and @fontsource/inter 5.1.1** — locally bundled display and body fonts.
  - [Fontsource documentation](https://fontsource.org/docs)

Versions above are the lockfile-resolved versions. The app does not use external runtime APIs or a remote service.

## Where It Runs and How Someone Tries It

- **Runtime:** modern desktop or mobile browser; no API keys, account, database, or server-side runtime required.
- **Prerequisites:** Node.js 20 or newer and npm for local development.
- **Try it locally:** run `npm ci`, then `npm run dev`, and open the local URL printed by Vite (normally `http://localhost:5173`).
- **Verify:** run `npm test` and `npm run build`.
- **Demo recording:** run the local app, open the Vite URL, and demonstrate a sample analysis, simple explanation, and warning-card opt-in. Deployment is optional; the local app is sufficient to record the demo.

Submission still requires both a short demo video and a public GitHub repository; deployment does not replace either.

## Look and Feel

Use a calm, protective visual tone rather than alarmist language. The light theme uses warm neutral surfaces and deep teal actions; verdict colors distinguish scam, suspicious, and fine states. Fraunces is used for headings and Inter for body copy. Keep the mobile-first layout spacious, text legible, controls easy to reach, and keyboard focus visible. Honor reduced-motion preferences and the system color scheme.

## Components

### `App` — `src/App.tsx`

Owns the page flow, sample selection, bounded message input, local analysis, verdict and score presentation, highlighted matches, next steps, simple-mode toggle, and warning-card launch.
PRD refs: `prd.md > Core Journey`; `prd.md > F1: Local Inspection Engine`; `prd.md > F2: Highlighting & Tooltips`; `prd.md > F3: "Explain simply" Mode`; `prd.md > F4: Shareable Warning Card`.

### `main.tsx` — `src/main.tsx`

Loads global styles and mounts the React app into the document root.
PRD ref: `prd.md > Core Journey`.

### Local inspection engine — `src/engine/index.ts`

Caps input at 5,000 characters, runs each detector, applies compound risk combinations and verdict thresholds, and returns tailored next steps. It has no network or UI dependency.
PRD ref: `prd.md > F1: Local Inspection Engine`.

### Signal detectors — `src/engine/signals/`

Ten independent deterministic checks: `sensitiveInfo`, `remoteAccess`, `suspiciousLinks`, `moneyRequest`, `threats`, `urgency`, `tooGoodToBeTrue`, `unsolicitedKyc`, `impersonation`, and `offPlatform`. Shared signal registration, weights, severities, and types live alongside the detectors.
PRD refs: `prd.md > F1: Local Inspection Engine`; `prd.md > F2: Highlighting & Tooltips`.

### Engine support — `src/engine/constants.ts`, `types.ts`, and `utils/`

Defines thresholds, compound combinations, result and match types, URL parsing, and match-span helpers. `src/engine/fixtures/` holds fictional benchmark messages and their tests.
PRD refs: `prd.md > F1: Local Inspection Engine`; `prd.md > F2: Highlighting & Tooltips`.

### Simple explanations — `src/engine/explainSimply.ts`

Maps the analysis result to short, plain-language guidance for the simplified view.
PRD ref: `prd.md > F3: "Explain simply" Mode`.

### `WarningCardModal` — `src/components/WarningCardModal.tsx`

Presents the card preview, opt-in control, PNG download, and clipboard action. It shows top reasons and the safety rule; message content appears only when the user opts in.
PRD ref: `prd.md > F4: Shareable Warning Card`.

### Share-card privacy helper — `src/components/shareCardPrivacy.ts`

Defaults message inclusion to off and returns message text only when inclusion is enabled; tests exercise this same helper.
PRD ref: `prd.md > F4: Shareable Warning Card`.

### `Badge` — `src/components/Badge.tsx`

Displays compact verdict or category labels.
PRD refs: `prd.md > F1: Local Inspection Engine`; `prd.md > F2: Highlighting & Tooltips`.

### `Button` — `src/components/Button.tsx`

Provides consistent accessible button styles and interaction states.
PRD refs: `prd.md > Core Journey`; `prd.md > F4: Shareable Warning Card`.

### `Card` — `src/components/Card.tsx`

Provides the shared bordered surface used to group app content.
PRD refs: `prd.md > Core Journey`; `prd.md > F1: Local Inspection Engine`.

### `Section` — `src/components/Section.tsx`

Provides consistent page-section layout and heading structure.
PRD refs: `prd.md > Core Journey`; `prd.md > F2: Highlighting & Tooltips`.

### `Toggle` — `src/components/Toggle.tsx`

Provides an accessible labeled switch for simple-explanation mode.
PRD ref: `prd.md > F3: "Explain simply" Mode`.

### `Tooltip` — `src/components/Tooltip.tsx`

Presents the plain-English reason associated with an interactive trigger highlight.
PRD ref: `prd.md > F2: Highlighting & Tooltips`.

### `DesignSystemPage` — `src/pages/DesignSystemPage.tsx`

Provides the local design-system preview route; it is a development/reference surface, not a separate product journey.
PRD ref: `prd.md > Look and Feel`.

### Styles and tokens — `src/styles/` and `src/utils/cn.ts`

Defines design tokens, responsive utilities, dark-mode colors, reduced-motion behavior, and class-name merging.
PRD refs: `prd.md > Look and Feel`; `prd.md > F2: Highlighting & Tooltips`; `prd.md > F3: "Explain simply" Mode`.

## Data Model

There is no persistent data model. React state holds the current message, analysis result, view toggles, validation state, and modal status in memory. Leaving or refreshing the page clears this state. Sample messages are bundled fictional examples; no personal message is saved. Clipboard read/write happens only when the visitor activates the related button.

The local engine returns an `AnalysisResult`: a verdict (`scam`, `suspicious`, or `fine`), a 0–100 score, detected signals with exact text spans and severity, and a list of next steps. The card includes the original message only when its opt-in is enabled.

## File Structure

```text
.
├── .github/
│   └── workflows/ci.yml             # Node 20 install, tests, and production build
├── src/
│   ├── App.tsx                       # Main page, input, results, and navigation
│   ├── main.tsx                      # React entry point and global CSS
│   ├── components/
│   │   ├── Badge.tsx                 # Verdict and category labels
│   │   ├── Button.tsx                # Accessible button styles
│   │   ├── Card.tsx                  # Shared surface primitives
│   │   ├── Section.tsx               # Page-section layout
│   │   ├── Toggle.tsx                # Accessible switch
│   │   ├── Tooltip.tsx               # Trigger explanations
│   │   ├── WarningCardModal.tsx      # Card preview and export
│   │   ├── shareCardPrivacy.ts       # Explicit opt-in message inclusion
│   │   └── index.ts                  # Component exports
│   ├── engine/
│   │   ├── constants.ts              # Weights, thresholds, combinations, next steps
│   │   ├── explainSimply.ts          # Plain-language explanations
│   │   ├── index.ts                  # Analysis pipeline and public exports
│   │   ├── types.ts                  # Analysis and signal types
│   │   ├── fixtures/                 # Fictional benchmark messages and tests
│   │   │   ├── index.ts              # 24 scam and legitimate message fixtures
│   │   │   └── fixtures.test.ts      # Fixture precision and sample coverage
│   │   ├── signals/                  # Ten rule detectors and detector tests
│   │   │   ├── impersonation.ts / .test.ts
│   │   │   ├── moneyRequest.ts / .test.ts
│   │   │   ├── offPlatform.ts / .test.ts
│   │   │   ├── remoteAccess.ts / .test.ts
│   │   │   ├── sensitiveInfo.ts / .test.ts
│   │   │   ├── suspiciousLinks.ts / .test.ts
│   │   │   ├── threats.ts / .test.ts
│   │   │   ├── tooGoodToBeTrue.ts / .test.ts
│   │   │   ├── unsolicitedKyc.ts / .test.ts
│   │   │   ├── urgency.ts / .test.ts
│   │   │   └── index.ts              # Detector registry
│   │   ├── utils/                    # Match and URL helpers
│   │   │   ├── matchHelper.ts
│   │   │   └── urlParser.ts
│   │   ├── engine.test.ts            # Engine behavior tests
│   │   ├── explainSimply.test.ts     # Explanation tests
│   │   └── securityAudit.test.ts     # Input, CSP, privacy, and source guardrails
│   ├── pages/
│   │   └── DesignSystemPage.tsx      # Local design-system reference
│   ├── styles/
│   │   ├── index.css                 # Global styles and font imports
│   │   └── tokens.css                # Theme and accessibility tokens
│   └── utils/
│       └── cn.ts                     # Class-name composition
├── index.html                        # Entry document, metadata, and CSP
├── package.json                      # Scripts and dependency declarations
├── package-lock.json                 # Reproducible dependency tree
├── postcss.config.js                 # CSS processing
├── tailwind.config.js                # Utility styling configuration
├── tsconfig.json                     # Strict TypeScript configuration
├── vite.config.ts                    # Vite and Vitest configuration
├── scope.md                           # Product boundary and audience
├── prd.md                             # User journey and behaviors
├── spec.md                            # This implementation blueprint
├── README.md                          # Setup and project overview
├── CONTRIBUTING.md                    # Contribution workflow and constraints
├── SECURITY.md                        # Privacy guarantees and reporting
└── LICENSE                            # MIT license
```

## External Services and Dependencies

There are no external runtime services, APIs, databases, or accounts. npm is used only to install the locked local toolchain. Vite serves files during local development. `html-to-image` renders DOM content locally, and browser clipboard APIs are used only on explicit user action. No message data is sent to either.

## Important Failure Modes

- **Clipboard access is unavailable or denied** → the user can paste manually; clipboard image copying reports a status and offers a text fallback.
- **PNG rendering fails in the browser** → the card remains available in the preview and the UI reports that image generation failed.
- **A message is longer than the supported limit** → the field and engine process no more than 5,000 characters.

## What Was Simplified and Why

- **Deterministic local rules** instead of a remote model or reputation service — makes the proof of concept private, explainable, and usable without keys or connectivity; coverage is limited to the implemented signals.
- **In-memory state** instead of accounts or a database — avoids retaining sensitive message content and keeps the app small.
- **Static benchmark fixtures** instead of live threat feeds — keeps tests reproducible and avoids network access.
- **Optional browser-generated sharing** instead of a server-generated image — avoids uploading a message or requiring a card-generation service.

## Decisions and Open Issues

The project artifacts and implementation establish a browser-only React/TypeScript app, a deterministic local rule engine, no persistence, fictional fixtures, and opt-in sharing. This spec records that existing implementation rather than attributing new architecture choices to the learner. The learner profile describes strong web-development and component-architecture experience and a preference for concise, execution-focused collaboration. No distinct technical uncertainty was recorded in the available project artifacts; clipboard image support remains a browser capability handled by the implemented fallback.

No backend, deployment target, or external service is required. The app can be demonstrated locally; hosting is optional.
