# Security Policy

## Privacy Model

Scam Shield is designed from the ground up as a **privacy-first, client-only application**:

- **100% On-Device Processing**: Every message is inspected entirely within the user's web browser using a pure TypeScript rule engine.
- **Zero Network Transmission**: Messages, phone numbers, account balances, and URLs are never transmitted to external servers, APIs, or databases.
- **Zero Credentials & Secrets**: The app requires no API keys, accounts, logins, or cookies.
- **Privacy by Default**: The shareable warning card generator strictly excludes personal message text unless the user explicitly opts in.

## Reporting a Vulnerability

We take the security and privacy of our users seriously. If you discover a security vulnerability or a potential ReDoS (Regular Expression Denial of Service) vector:

1. **Do not create a public GitHub issue.**
2. If enabled, report it privately via **GitHub Private Vulnerability Reporting** on the repository's **Security** tab. Otherwise, contact the repository maintainers privately through GitHub; do not publish exploit details.
3. Include details of the potential issue, an example test input, and steps to reproduce.

Please allow maintainers a reasonable opportunity to reproduce and address the report before public disclosure. Do not include real users' messages, credentials, or other sensitive personal data in a report.

## Security Checks

The project uses a 5,000-character cap on message input and analysis, a Content Security Policy meta tag, and tests that guard against dangerous HTML insertion and network APIs in application source. Dependencies are installed from the lockfile with `npm ci`; CI runs the test suite and production build.
