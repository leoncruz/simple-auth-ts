import { Request, Response } from 'express';
import { Session } from '../accounts/Session';

const create = async (req: Request, resp: Response) => {
  const { email, password } = req.body;

  const { data, success, message } = await Session.create(email, password);

  if (!success) {
    resp.statusCode = 422;
    return resp.json({ data: {}, success: false, message });
  }

  const { accessToken, refreshToken } = data ?? {};

  resp.statusCode = 200;
  resp.json({
    data: { access_token: accessToken, refresh_token: refreshToken },
    success: true
  });
};

export const UserSessionController = { create };
