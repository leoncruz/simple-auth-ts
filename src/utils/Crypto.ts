import crypto from 'crypto';

const secureRandonInt = (): number => {
  return crypto.randomInt(0, 1000000);
};

const hmacDigest = (message: string | number): string => {
  const hmacHash = crypto.createHmac('sha256', 'MY_BIGGEST_SECRET');

  return hmacHash.update(message.toString()).digest('hex');
};

export const Crypto = {
  secureRandonInt,
  hmacDigest
};
