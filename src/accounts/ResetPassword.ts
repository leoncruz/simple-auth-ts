import { intervalToDuration } from 'date-fns';
import { User } from '../entities/User';
import { Crypto } from '../utils/Crypto';
import { Repo } from '../utils/Repo';
import { GenerateToken } from './GenerateToken';

const RESET_PASSWORD_TOKEN_EXPIRES = 5;

const createResetPasswordToken = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  if (!email) return { success: false, message: 'invalid email' };

  const user = new User(await Repo.findOne(User, { where: { email: email } }));

  console.log(email);

  if (!user.id) {
    return { success: true, message: 'reset token was sended' };
  }

  const [plainResetPasswordToken, hashedResetPasswordToken] =
    GenerateToken.generateResetPasswordToken();

  console.log({ plainResetPasswordToken });

  const result = await Repo.update(User, user.id, {
    resetPasswordToken: hashedResetPasswordToken,
    resetPasswordTokenSentAt: new Date()
  });

  if (!result) {
    return { success: false, message: 'token cannot be sended' };
  }

  // send plainResetPasswordToken to user using email, sms, etc

  return { success: true, message: 'token was sended' };
};

const validateResetPasswordToken = async (
  token: string
): Promise<{ success: boolean; message: string; newResetToken?: string }> => {
  const hashedResetPasswordToken = Crypto.hmacDigest(token);

  const user = new User(
    await Repo.findOne(User, {
      where: { resetPasswordToken: hashedResetPasswordToken }
    })
  );

  if (!user.id) return { success: false, message: 'invalid token' };

  const elapsedTime = intervalToDuration({
    start: new Date(),
    end: user.resetPasswordTokenSentAt
  });

  if (elapsedTime.minutes ?? 0 > RESET_PASSWORD_TOKEN_EXPIRES) {
    return { success: false, message: 'token is invalid or has expired' };
  }

  const newResetToken = Crypto.generateUUID();
  const hashedNewResetToken = Crypto.hmacDigest(newResetToken);

  await Repo.update(User, user.id, {
    resetPasswordToken: hashedNewResetToken,
    resetPasswordTokenSentAt: null
  });

  return { success: true, message: 'valid token', newResetToken };
};

const update = async (
  email: string,
  newPassword: string,
  resetPasswordToken: string
): Promise<{ success: boolean; message: string }> => {
  const hashedResetToken = Crypto.hmacDigest(resetPasswordToken);

  const user = new User(
    await Repo.findOne(User, {
      where: { email, resetPasswordToken: hashedResetToken }
    })
  );

  if (!user.id) return { success: false, message: 'invalid data' };

  user.changePassword(newPassword);

  const result = await Repo.update(User, user.id, {
    encryptedPassword: user.password,
    resetPasswordToken: null
  });

  if (!result) {
    return { success: false, message: 'password cannot be updated.' };
  }

  return { success: true, message: 'password updated successfully' };
};

export const ResetPassword = {
  createResetPasswordToken,
  validateResetPasswordToken,
  update
};
