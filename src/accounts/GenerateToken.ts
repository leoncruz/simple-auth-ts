import { JwtPayload } from 'jsonwebtoken';
import { Crypto } from '../utils/Crypto';

const EXPIRATION_TIME_FOR_ACCESS_TOKEN = '15m';
const ACCESS_TOKEN_SECRET = 'MY_BIGGEST_SECRET';

const generateConfirmAccountToken = (): Array<string> => {
  const token = Crypto.secureRandonInt().toString();
  const hashedToken = Crypto.hmacDigest(token);

  return [token, hashedToken];
};

const generateSessionTokens = (data: number): Array<string> => {
  const refreshToken = Crypto.generateUUID();
  const hashedRefreshToken = Crypto.hmacDigest(refreshToken);
  const jwtToken = Crypto.generateTokenJWT(
    data,
    ACCESS_TOKEN_SECRET,
    EXPIRATION_TIME_FOR_ACCESS_TOKEN
  );

  return [jwtToken, refreshToken, hashedRefreshToken];
};

const validateSessionToken = (
  token: string
): { valid: boolean; message: string; data?: JwtPayload | string } => {
  try {
    const decoded = Crypto.decodeTokenJWT(token, ACCESS_TOKEN_SECRET);

    return { valid: true, data: decoded.data, message: 'decoded successfully' };
  } catch (error: any) {
    if (
      error.message.includes('jwt malformed') ||
      error.message.includes('invalid signature')
    ) {
      return { valid: false, message: 'invalid token' };
    } else if (error.message.includes('jwt expired')) {
      return { valid: false, message: 'expired token' };
    }
  }

  return { valid: false, message: 'unexpected error' };
};

const generateResetPasswordToken = (): Array<string> => {
  const token = Crypto.secureRandonInt().toString();
  const hashedToken = Crypto.hmacDigest(token);

  return [token, hashedToken];
};

export const GenerateToken = {
  generateConfirmAccountToken,
  generateSessionTokens,
  validateSessionToken,
  generateResetPasswordToken
};
