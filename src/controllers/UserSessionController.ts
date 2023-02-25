import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const create = async (req: Request, resp: Response) => {
  const { email, password } = req.body;

  const user = await AppDataSource.manager.findOneBy(User, { email });

  if (!user || !user.passwordIsValid(password)) {
    resp.statusCode = 422;
    return resp.json({ success: false, data: 'invalid data' });
  }

  if (!user.confirmedAccount) {
    resp.statusCode = 422;
    return resp.json({ success: false, data: 'account not confirmed' });
  }

  const token = jwt.sign({ data: user.id }, 'MY_BIGGEST_SECRET', {
    expiresIn: '5m'
  });

  resp.statusCode = 200;
  resp.json({
    data: { access_token: token, refresh_token: '' },
    success: true
  });
};

export const UserSessionController = { create };
