# Contributing to Scam Shield

Thank you for your interest in improving Scam Shield! We welcome contributions that uphold our core principles: privacy-first, on-device determinism, and high accessibility.

## Guidelines

1. **Privacy-First**: No code may introduce external network calls, remote telemetry, tracking scripts, or cloud AI dependencies. All analysis must run 100% on-device.
2. **Deterministic Engine**: Fraud detection rules must be predictable, auditable, and backed by automated unit tests in `src/engine/`.
3. **Fictional Brands Only**: Never use real trademarks or company logos in fixtures, tests, or documentation. Use fictional examples only (e.g., "Example Bank", "QuickParcel").
4. **Accessibility (WCAG 2.2 AA+)**: Ensure all UI changes preserve keyboard navigation, visible focus rings, 44px minimum touch targets, and screen reader announcements.

## Development Workflow

### Prerequisites

- Node.js 20 or newer
- npm

### Changes and Pull Requests

1. Create a focused branch from `main`.
2. Keep the app client-only: do not add analytics, remote APIs, telemetry, or network transmission of message content.
3. Use fictional brands in examples and fixtures.
4. Add or update tests for behavior changes, especially rule-engine precision, input limits, privacy, and accessibility.
5. Run the full local checks below and describe the behavior change and verification in your pull request.

```bash
# 1. Install dependencies
npm ci

# 2. Run test suite
npm test

# 3. Start local development server
npm run dev

# 4. Verify production build
npm run build
```

Pull requests should pass the GitHub Actions workflow on Node.js 20. Please do not include real personal message data, credentials, private keys, or user-specific local files in commits.
