import { addDays } from 'date-fns';
import { AccessToken } from '../entities/AccessToken';
import { User } from '../entities/User';
import { Repo } from '../utils/Repo';
import { GenerateToken } from './GenerateToken';

type SessionResult = {
  data?: { accessToken: string; refreshToken: string };
  success: boolean;
  message: string;
};

const create = async (
  email: string,
  password: string
): Promise<SessionResult> => {
  const user = new User(await Repo.findOne(User, { email }));

  if (!user || !user.passwordIsValid(password)) {
    return { success: false, message: 'invalid data' };
  }

  if (user && !user.confirmedAccount) {
    return { success: false, message: 'invalid data' };
  }

  const [accessToken, refreshToken, hashedRefreshToken] =
    GenerateToken.generateSessionTokens(user.id);

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

export const Session = {
  create
};
