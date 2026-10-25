import { AnalysisResult } from './types';

export interface DoDontStep {
  stepNumber: number;
  title: string;
  doThis: string;
  dontDoThis: string;
}

export interface SimpleExplanation {
  headline: string;
  simpleSummary: string;
  steps: [DoDontStep, DoDontStep, DoDontStep];
}

/**
 * Returns a jargon-free, template-based explanation for older family members and beginners.
 * Pure deterministic logic — 0 AI calls, 0 network dependencies.
 */
export function getSimpleExplanation(analysis: AnalysisResult): SimpleExplanation {
  const signalIds = new Set(analysis.signals.map((s) => s.id));

  if (analysis.verdict === 'scam') {
    // Tailor Step 2 based on most dangerous detected signal
    let step2Dont = "Don't share OTP codes, bank PINs, or debit card numbers with anyone.";
    let step2Do = "Keep all secret codes to yourself. Real banks never ask you to share them.";

    if (signalIds.has('remote_access')) {
      step2Dont = "Don't install AnyDesk, QuickSupport, or any app they tell you to download.";
      step2Do = "Hang up or block the sender. They want to see and control your screen.";
    } else if (signalIds.has('money_request')) {
      step2Dont = "Don't send any fee, gift card, Bitcoin, or deposit to claim money or fix an account.";
      step2Do = "Keep your money safe. Real companies will never ask you to pay using gift cards or crypto.";
    } else if (signalIds.has('unsolicited_kyc')) {
      step2Dont = "Don't upload your Aadhaar card, PAN card, or ID documents to links in text messages.";
      step2Do = "Visit your bank branch in person or use the official banking app to update records.";
    }

    return {
      headline: 'Someone is trying to trick you.',
      simpleSummary:
        'This message has danger signs. A scammer wants to take your money, passwords, or phone access. Real companies do not message you like this.',
      steps: [
        {
          stepNumber: 1,
          title: 'Stop and Pause',
          dontDoThis: "Don't tap any links, and don't call the phone number inside this message.",
          doThis: 'Take a breath. Scammers make you panic so you act before thinking.',
        },
        {
          stepNumber: 2,
          title: 'Protect Your Secrets',
          dontDoThis: step2Dont,
          doThis: step2Do,
        },
        {
          stepNumber: 3,
          title: 'Verify Safely',
          dontDoThis: "Don't reply to the message or pay any money to clear the issue.",
          doThis: 'Call the official telephone number printed on the back of your bank card or monthly bill.',
        },
      ],
    };
  }

  if (analysis.verdict === 'suspicious') {
    return {
      headline: 'Be careful before you answer.',
      simpleSummary:
        'This message has warning signs. It might be fake or trying to get personal details. It is always safest to pause and check first.',
      steps: [
        {
          stepNumber: 1,
          title: 'Do Not Rush',
          dontDoThis: "Don't click links to unverified websites or join private chat rooms on Telegram or WhatsApp.",
          doThis: 'Ignore any false sense of urgency. Real organizations give you time.',
        },
        {
          stepNumber: 2,
          title: 'Keep Information Safe',
          dontDoThis: "Don't share passwords, one-time codes, or personal account numbers.",
          doThis: 'Keep your personal details safe. Real staff do not need your password.',
        },
        {
          stepNumber: 3,
          title: 'Double Check',
          dontDoThis: "Don't trust web links or callback numbers sent directly in this text.",
          doThis: 'Open the verified app or official website on your phone yourself.',
        },
      ],
    };
  }

  // Legitimate / Fine
  return {
    headline: 'This message looks normal.',
    simpleSummary:
      'We did not find common scam trick words, urgent threats, or suspicious links. However, always stay alert with any unsolicited text message.',
    steps: [
      {
        stepNumber: 1,
        title: 'Check the Context',
        dontDoThis: "Don't assume any message is 100% safe if it suddenly asks you for money later.",
        doThis: 'Confirm this message matches an order, visit, or appointment you actually made.',
      },
      {
        stepNumber: 2,
        title: 'Keep Codes Secret',
        dontDoThis: 'Never share OTP codes or passwords with anyone who calls or texts you.',
        doThis: 'Treat security codes like your house key: never hand them to strangers.',
      },
      {
        stepNumber: 3,
        title: 'When in Doubt, Ask',
        dontDoThis: "Don't click unfamiliar links if the sender sends follow-up messages.",
        doThis: 'If something feels unusual, show it to a family member or call the company directly.',
      },
    ],
  };
}
