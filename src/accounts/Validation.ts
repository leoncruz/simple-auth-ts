import { User } from '../entities/User';

type ValidationError = {
  email: string[];
  password: string[];
};

type ValidationResult = {
  errors: ValidationError;
  valid: boolean;
};

const validateForRegistration = (user: Partial<User>): ValidationResult => {
  const errors = {} as ValidationError;
  errors.email = [];
  errors.password = [];

  if (user.email?.length === 0) {
    errors.email.push("email can't be blank");
  }

  if (!/(@|\.com)/.test(user.email ?? '')) {
    errors.email.push('email is invalid');
  }

  if (user.password?.length === 0) {
    errors.password.push("password can't be blank");
  }

  if ((user.password?.length ?? 0) < 6) {
    console.log(user.password?.length);
    errors.password.push('password must have at least 6 characters');
  }

  return {
    errors,
    valid: errors.password.length === 0 && errors.email.length === 0
  };
};

export const Validation = {
  validateForRegistration
};
