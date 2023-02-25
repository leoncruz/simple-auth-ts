import { User } from '../entities/User';
import { Repo } from '../utils/Repo';
import { GenerateToken } from './GenerateToken';

type RegistrationResult = {
  userExists?: boolean;
  user?: User;
  userInvalid?: boolean;
};

const registrationUser = async (
  userData: Partial<User>
): Promise<RegistrationResult> => {
  const newUser = new User(userData);

  const valid = true; // validate user data;

  if (!valid) return { userInvalid: false };

  const user = await Repo.insert<User>(User, newUser);

  if (!user) return { userInvalid: true };

  const [plainToken, hashedToken] = GenerateToken.generateConfirmAccountToken();

  console.log({ plainToken });

  // send plainToken to user using email, sms, ect

  await Repo.update(User, user.id, {
    confirmationToken: hashedToken,
    confirmationTokenSentAt: new Date()
  });

  return { user };
};

export const Registation = {
  registrationUser
};
