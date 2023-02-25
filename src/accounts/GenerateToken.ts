import { Crypto } from '../utils/Crypto';

const generateConfirmAccountToken = (): Array<string> => {
  const token = Crypto.secureRandonInt().toString();
  const hashedToken = Crypto.hmacDigest(token);

  return [token, hashedToken];
};

export const GenerateToken = {
  generateConfirmAccountToken
};
