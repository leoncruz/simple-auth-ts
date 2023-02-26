import jwt from 'jsonwebtoken';

import { Crypto } from '../utils/Crypto';

const EXPIRATION_TIME_FOR_ACCESS_TOKEN = '5m';
const ACCESS_TOKEN_SECRET = 'MY_BIGGEST_SECRET';

const generateConfirmAccountToken = (): Array<string> => {
  const token = Crypto.secureRandonInt().toString();
  const hashedToken = Crypto.hmacDigest(token);

  return [token, hashedToken];
};

const generateSessionTokens = (data: number): Array<string> => {
  const refreshToken = Crypto.generateUUID();
  const hashedRefreshToken = Crypto.hmacDigest(refreshToken);

  const jwtToken = jwt.sign({ data }, ACCESS_TOKEN_SECRET, {
    expiresIn: EXPIRATION_TIME_FOR_ACCESS_TOKEN
  });

  return [jwtToken, refreshToken, hashedRefreshToken];
};

export const GenerateToken = {
  generateConfirmAccountToken,
  generateSessionTokens
};
