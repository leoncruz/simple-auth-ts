import { intervalToDuration } from 'date-fns';
import { User } from '../entities/User';
import { Crypto } from '../utils/Crypto';
import { Repo } from '../utils/Repo';
import { GenerateToken } from './GenerateToken';

const CONFIRMATION_ACCOUNT_EXPIRES = 5;

type SendConfirmationAccountToken = {
  success: boolean;
  message?: string;
};

const sendConfirmationAccountToken = async (
  email: string
): Promise<SendConfirmationAccountToken> => {
  const existingUser = await Repo.findOne(User, { email });

  if (!existingUser) {
    return { success: false };
  }

  const user = new User(existingUser);

  if (user.confirmationAt !== null) {
    return { success: true };
  }

  const [plainToken, hashedToken] = GenerateToken.generateConfirmAccountToken();

  console.log({ plainToken });

  // send plainToken to user using email, sms, ect

  await Repo.update(User, user.id, {
    confirmationToken: hashedToken,
    confirmationTokenSentAt: new Date()
  });

  return { success: true, message: 'token was sended' };
};

type ConfirmationResult = {
  success: boolean;
  message?: string;
};

const confirmAccountToken = async (
  token: string
): Promise<ConfirmationResult> => {
  const hashedToken = Crypto.hmacDigest(token);

  const existingUser = await Repo.findOne(User, {
    confirmationToken: hashedToken
  });

  if (!existingUser) {
    return { success: false, message: 'token is invalid or has expired' };
  }

  const user = new User(existingUser);

  if (user.confirmationAt !== null) {
    return { success: true, message: '' };
  }

  const elapsedTime = intervalToDuration({
    start: new Date(),
    end: user.confirmationTokenSentAt
  });

  if (elapsedTime.minutes ?? 0 > CONFIRMATION_ACCOUNT_EXPIRES) {
    return { success: false, message: 'token is invalid or has expired' };
  }

  await Repo.update(User, user.id, {
    confirmationAt: new Date(),
    confirmationToken: null,
    confirmationTokenSentAt: null
  });

  return { success: true, message: 'account confirmed' };
};

export const Confirmation = {
  confirmAccountToken,
  sendConfirmationAccountToken
};
