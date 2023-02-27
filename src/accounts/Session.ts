import { addDays } from 'date-fns';
import { AccessToken } from '../entities/AccessToken';
import { User } from '../entities/User';
import { Crypto } from '../utils/Crypto';
import { Repo } from '../utils/Repo';
import { GenerateToken } from './GenerateToken';

const DAYS_FOR_REFRESH_TOKEN = 7;

type SessionResult = {
  data?: { accessToken: string; refreshToken: string };
  success: boolean;
  message: string;
};

const create = async (
  email: string,
  password: string
): Promise<SessionResult> => {
  const user = new User(
    await Repo.findOne(User, { where: { email }, relations: ['accessTokens'] })
  );

  if (!user || !user.passwordIsValid(password)) {
    return { success: false, message: 'invalid data' };
  }

  if (user && !user.confirmedAccount) {
    return { success: false, message: 'invalid data' };
  }

  const [accessToken, refreshToken, hashedRefreshToken] =
    GenerateToken.generateSessionTokens(user.id);

  await Repo.remove(AccessToken, { user });

  await Repo.insert(AccessToken, {
    code: hashedRefreshToken,
    expiresIn: addDays(new Date(), 7),
    user: user
  });

  return {
    data: { accessToken: accessToken, refreshToken: refreshToken },
    success: true,
    message: 'logged sucessfully'
  };
};

const newSession = async (oldRefreshToken: string): Promise<SessionResult> => {
  const hashedRefreshToken = Crypto.hmacDigest(oldRefreshToken);

  const accessToken = new AccessToken(
    await Repo.findOne(AccessToken, {
      where: { code: hashedRefreshToken },
      relations: ['user']
    })
  );

  if (!accessToken.id || !accessToken.user || !accessToken.isValid) {
    return { success: false, message: 'invalid data' };
  }

  const { user } = accessToken;

  const [newAccessToken, newRefreshToken, newHashedRefreshToken] =
    GenerateToken.generateSessionTokens(user.id);

  await Repo.remove(AccessToken, { id: accessToken.id });

  await Repo.insert(AccessToken, {
    code: newHashedRefreshToken,
    expiresIn: addDays(new Date(), DAYS_FOR_REFRESH_TOKEN),
    user: user
  });

  return {
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    success: true,
    message: 'refresh sucessfully'
  };
};

export const Session = {
  create,
  new: newSession
};
