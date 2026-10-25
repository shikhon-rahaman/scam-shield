import { SignalDefinition } from '../types';
import { urgencySignal } from './urgency';
import { sensitiveInfoSignal } from './sensitiveInfo';
import { moneyRequestSignal } from './moneyRequest';
import { threatsSignal } from './threats';
import { suspiciousLinksSignal } from './suspiciousLinks';
import { impersonationSignal } from './impersonation';
import { tooGoodToBeTrueSignal } from './tooGoodToBeTrue';
import { unsolicitedKycSignal } from './unsolicitedKyc';
import { remoteAccessSignal } from './remoteAccess';
import { offPlatformSignal } from './offPlatform';

export {
  urgencySignal,
  sensitiveInfoSignal,
  moneyRequestSignal,
  threatsSignal,
  suspiciousLinksSignal,
  impersonationSignal,
  tooGoodToBeTrueSignal,
  unsolicitedKycSignal,
  remoteAccessSignal,
  offPlatformSignal,
};

export const ALL_SIGNALS: SignalDefinition[] = [
  urgencySignal,
  sensitiveInfoSignal,
  moneyRequestSignal,
  threatsSignal,
  suspiciousLinksSignal,
  impersonationSignal,
  tooGoodToBeTrueSignal,
  unsolicitedKycSignal,
  remoteAccessSignal,
  offPlatformSignal,
];
