import { Verdict } from '../types';

export interface FixtureMessage {
  id: string;
  name: string;
  text: string;
  expectedVerdict: Verdict;
  category: 'bank' | 'courier' | 'job' | 'tax' | 'telecom' | 'tech_support' | 'utility' | 'lottery' | 'appointment' | 'personal';
  notes?: string;
}

export interface SamplePreset {
  id: string;
  name: string;
  title: string;
  verdict: Verdict;
  category: string;
  text: string;
}

/**
 * 14+ Realistic scam messages across banking, courier, fake job, lottery, tech support,
 * electricity, telecom, and tax impersonation. Fictional brands only.
 */
export const SCAM_FIXTURES: FixtureMessage[] = [
  {
    id: 'scam-01-bank-kyc',
    name: 'Urgent Bank KYC Account Lock',
    text: 'URGENT: Your Example Bank account has been locked due to pending KYC. Update your Aadhaar card immediately at http://bit.ly/example-kyc-verify within 24 hours to prevent permanent account suspension.',
    expectedVerdict: 'scam',
    category: 'bank',
  },
  {
    id: 'scam-02-otp-harvest',
    name: 'Card Block Threat with OTP Demand',
    text: 'Example Bank Security: Unauthorized charge of $450 detected. To stop immediate card deactivation, please share your OTP code with our verification agent now.',
    expectedVerdict: 'scam',
    category: 'bank',
  },
  {
    id: 'scam-03-wfh-job-fee',
    name: 'Work-From-Home Task Scam with Upfront Fee',
    text: 'QuickCareers Alert: Congratulations! You have been selected for part-time work from home with no experience needed. Earn $500 per day. Pay registration fee of $25 and message me on Telegram @quick_hr to start today.',
    expectedVerdict: 'scam',
    category: 'job',
  },
  {
    id: 'scam-04-remote-desktop-takeover',
    name: 'Tech Support Malware Remote Access',
    text: 'QuickTech Support: Critical spyware detected on your computer. Install support app immediately and grant remote access to your screen so our engineers can remove it.',
    expectedVerdict: 'scam',
    category: 'tech_support',
  },
  {
    id: 'scam-05-courier-customs-fee',
    name: 'Parcel Held with Customs Fee Link',
    text: 'QuickParcel Notice: Your international parcel #QP-94812 is held at customs. Pay customs fee of $4.99 at http://quickparcel-customs.xyz/pay within 12 hours or item will be returned.',
    expectedVerdict: 'scam',
    category: 'courier',
  },
  {
    id: 'scam-06-lottery-advance-fee',
    name: 'Lottery Prize with Bitcoin/Gift Card Fee',
    text: 'Congratulations! You have won $500,000 in the Example Global Lucky Draw! To claim your cash prize, send a processing fee of $150 via Bitcoin or gift card.',
    expectedVerdict: 'scam',
    category: 'lottery',
  },
  {
    id: 'scam-07-power-disconnect-threat',
    name: 'Electricity Disconnection Tonight',
    text: 'National Electric Alert: Your electricity power will be cut off tonight at 9:30 PM due to unpaid bill. Action required now: pay immediate fee at http://bit.ly/power-pay.',
    expectedVerdict: 'scam',
    category: 'utility',
  },
  {
    id: 'scam-08-sim-deactivation-link',
    name: 'SIM Deactivation Biometric KYC',
    text: 'Apex Telecom: Your SIM card deactivation is scheduled within 24 hours. Update your biometric KYC immediately at http://apex-telecom.top/kyc before service termination.',
    expectedVerdict: 'scam',
    category: 'telecom',
  },
  {
    id: 'scam-09-tax-refund-harvesting',
    name: 'Unclaimed Tax Refund Credential Phishing',
    text: 'GovTax Department: You have an unclaimed tax refund of $1,420 waiting. Click http://govtax-refund-claim.xyz to submit your bank credentials and debit card details immediately.',
    expectedVerdict: 'scam',
    category: 'tax',
  },
  {
    id: 'scam-10-crypto-doubler-whatsapp',
    name: 'Guaranteed Crypto Returns & WhatsApp Funnel',
    text: 'Apex Wealth: Double your money in 48 hours with guaranteed profit! Transfer funds to our crypto wallet. Message our manager on WhatsApp at +1-555-0192 to claim bonus.',
    expectedVerdict: 'scam',
    category: 'lottery',
  },
  {
    id: 'scam-11-bank-fraud-hotline-app',
    name: 'Fraud Desk Remote App Installation',
    text: 'Example Bank Alert: A charge of $899.00 on your account is pending. If not authorized, call our fraud desk immediately and install support app to reverse.',
    expectedVerdict: 'scam',
    category: 'bank',
  },
  {
    id: 'scam-12-free-gift-survey',
    name: 'Free Luxury Gift Survey Trap',
    text: 'Example Rewards: Congrats! You were selected to receive a free gift card. Claim your prize now at http://free-gift-rewards.click before it expires today.',
    expectedVerdict: 'scam',
    category: 'lottery',
  },
  {
    id: 'scam-13-courier-redelivery-shortener',
    name: 'Failed Delivery Reschedule Shortlink',
    text: 'FastCourier: We tried to deliver your parcel but no one was home. Action required now: reschedule delivery at http://tinyurl.com/fastcourier-deliver immediately.',
    expectedVerdict: 'scam',
    category: 'courier',
  },
  {
    id: 'scam-14-police-arrest-warrant',
    name: 'Legal Threat & Arrest Warrant Fine Demand',
    text: 'Example Judicial Bureau: An arrest warrant and legal notice have been issued against your name for non-compliance. Settle your penalty of $500 immediately to avoid arrest.',
    expectedVerdict: 'scam',
    category: 'tax',
  },
  {
    id: 'scam-15-lookalike-domain',
    name: 'Lookalike Domain Security Alert',
    text: 'Example Bank Alert: Suspicious login from an unknown device. Visit http://examplebank-secure-login.xyz/portal within 24 hours to secure your account or it will be suspended.',
    expectedVerdict: 'scam',
    category: 'bank',
  },
];

/**
 * 8+ Legitimate messages that must NEVER be flagged as scams.
 * Includes delivery updates, appointment reminders, bank transaction notifications with no links,
 * and security-conscious OTP delivery messages containing "DO NOT SHARE". Fictional brands only.
 */
export const LEGITIMATE_FIXTURES: FixtureMessage[] = [
  {
    id: 'legit-01-courier-delivery',
    name: 'Legitimate Courier Delivery Status',
    text: 'QuickParcel: Your package #QP-83921 is out for delivery today with our driver Leo. Delivery expected between 2:00 PM and 5:00 PM. No signature required.',
    expectedVerdict: 'fine',
    category: 'courier',
  },
  {
    id: 'legit-02-dental-appointment',
    name: 'Doctor Appointment Reminder',
    text: 'Metro Dental: Reminder that your routine cleaning appointment with Dr. Davis is scheduled for tomorrow at 10:30 AM. Reply 1 to confirm or call the clinic to reschedule.',
    expectedVerdict: 'fine',
    category: 'appointment',
  },
  {
    id: 'legit-03-bank-transaction-alert',
    name: 'Bank Transaction Debit Alert (No Links/Demands)',
    text: 'Example Bank Alert: Your debit card ending in 4102 was charged $34.50 at Corner Supermarket on Oct 24. Your available balance is $1,420.15.',
    expectedVerdict: 'fine',
    category: 'bank',
  },
  {
    id: 'legit-04-otp-do-not-share',
    name: 'Legitimate OTP Code with "Do Not Share" Warning',
    text: 'Your Example Bank verification code is 482910 for your online purchase of $28.00. DO NOT SHARE this code with anyone, including bank employees. We will never ask for your code.',
    expectedVerdict: 'fine',
    category: 'bank',
  },
  {
    id: 'legit-05-flight-boarding-update',
    name: 'Airline Gate and Boarding Notice',
    text: 'SkyAir Update: Flight SK-402 to Chicago is boarding now at Gate 14. Please have your boarding pass ready. Have a safe flight!',
    expectedVerdict: 'fine',
    category: 'personal',
  },
  {
    id: 'legit-06-restaurant-reservation',
    name: 'Dinner Table Reservation Confirmation',
    text: 'Bella Bistro: Table reservation confirmed for 4 guests on Friday, Oct 28 at 7:30 PM. We look forward to seeing you!',
    expectedVerdict: 'fine',
    category: 'personal',
  },
  {
    id: 'legit-07-library-hold-ready',
    name: 'Public Library Book Ready for Pickup',
    text: 'Community Library: The book "The Art of Design" you requested is now ready for pickup at the front desk. Held until Nov 2.',
    expectedVerdict: 'fine',
    category: 'personal',
  },
  {
    id: 'legit-08-pharmacy-prescription-ready',
    name: 'Pharmacy Prescription Pickup Notice',
    text: 'Metro Pharmacy: Your prescription refill #RX-8841 is ready for collection at the counter during regular store hours. Thank you!',
    expectedVerdict: 'fine',
    category: 'personal',
  },
  {
    id: 'legit-09-school-transit-delay',
    name: 'Transit Authority Delay Notice',
    text: 'Oakridge Transit: School Bus Route 4 is running approximately 15 minutes late this morning due to road maintenance. Thank you for your patience.',
    expectedVerdict: 'fine',
    category: 'personal',
  },
];

export const ALL_FIXTURES: FixtureMessage[] = [...SCAM_FIXTURES, ...LEGITIMATE_FIXTURES];

/**
 * 6 Curated sample messages spanning all verdicts, used by UI "Try an example" buttons.
 */
export const samples: SamplePreset[] = [
  {
    id: 'sample-fake-bank-kyc',
    name: 'Bank KYC Lock',
    title: 'Bank KYC Lock (Scam)',
    verdict: 'scam',
    category: 'Bank Impersonation',
    text: 'URGENT: Your Example Bank account has been locked due to pending KYC. Update your Aadhaar card immediately at http://bit.ly/example-kyc-verify within 24 hours to prevent permanent account suspension.',
  },
  {
    id: 'sample-remote-support',
    name: 'Remote Tech Support',
    title: 'Remote Support (Scam)',
    verdict: 'scam',
    category: 'Tech Support Fraud',
    text: 'QuickTech Support: Critical spyware detected on your computer. Install support app immediately and grant remote access to your screen so our engineers can remove it.',
  },
  {
    id: 'sample-unverified-shortlink',
    name: 'Unverified Link',
    title: 'Unverified Link (Suspicious)',
    verdict: 'suspicious',
    category: 'Suspicious Link',
    text: 'Notice: We attempted to reach you regarding changes to your profile. Please review the updated terms within 24 hours at http://portal-check.xyz/view.',
  },
  {
    id: 'sample-telegram-inquiry',
    name: 'Job via Telegram',
    title: 'Job Off-Platform (Suspicious)',
    verdict: 'suspicious',
    category: 'Off-Platform Chat',
    text: 'Hello, I reviewed your CV for the editorial assistant position. If you are still seeking remote employment, please message our recruiter on Telegram at @recruiter_job.',
  },
  {
    id: 'sample-bank-txn-alert',
    name: 'Bank Debit Alert',
    title: 'Bank Debit Alert (Legitimate)',
    verdict: 'fine',
    category: 'Bank Transaction',
    text: 'Example Bank Alert: Your debit card ending in 4102 was charged $34.50 at Corner Supermarket on Oct 24. Your available balance is $1,420.15.',
  },
  {
    id: 'sample-legit-otp-sms',
    name: 'Legitimate OTP Notice',
    title: 'Legitimate OTP Notice (Legitimate)',
    verdict: 'fine',
    category: 'Security OTP',
    text: 'Your Example Bank verification code is 482910 for your online purchase of $28.00. DO NOT SHARE this code with anyone, including bank employees. We will never ask for your code.',
  },
];

export const SAMPLE_PRESETS = samples;
