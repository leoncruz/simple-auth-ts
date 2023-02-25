import { Request, Response } from 'express';
import { Registation } from '../accounts/Registration';

const create = async (req: Request, resp: Response) => {
  const { email, password } = req.body;

  const { user, userExists, userInvalid } = await Registation.registrationUser({
    email,
    password
  });

  if (userExists || userInvalid) {
    resp.statusCode = 422;
    return resp.json({ data: {}, message: 'invalid data', success: false });
  }

  if (!user) {
    resp.statusCode = 400;
    return resp.json({
      data: {},
      message: 'an unexpected error occours',
      success: false
    });
  }

  resp.json({ data: user, success: true });
};

export const UserRegistrationController = { create };
