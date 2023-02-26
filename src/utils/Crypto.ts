import crypto from 'crypto';
import { v4 as uuid4 } from 'uuid';
import jwt from 'jsonwebtoken';

const secureRandonInt = (): number => {
  return crypto.randomInt(0, 1000000);
};

const hmacDigest = (message: string | number): string => {
  const hmacHash = crypto.createHmac('sha256', 'MY_BIGGEST_SECRET');

  return hmacHash.update(message.toString()).digest('hex');
};

const generateUUID = () => uuid4();

const generateTokenJWT = (data: number, secret: string, expiresIn: string) => {
  return jwt.sign({ data }, secret, { expiresIn });
};

const decodeTokenJWT = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const Crypto = {
  secureRandonInt,
  hmacDigest,
  generateUUID,
  generateTokenJWT,
  decodeTokenJWT
};
