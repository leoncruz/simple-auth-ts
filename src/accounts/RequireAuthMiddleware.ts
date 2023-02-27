import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/User';
import { Repo } from '../utils/Repo';
import { GenerateToken } from './GenerateToken';

const init = async (req: Request, resp: Response, next: NextFunction) => {
  const authorizationHeader = req.get('Authorization');
  const [prefix, accessToken] = (authorizationHeader ?? '').split(' ');

  if (prefix !== 'Bearer') {
    resp.statusCode = 401;
    return resp.json({
      data: {},
      success: false,
      message: 'unauthorized access'
    });
  }

  const { valid, data, message } =
    GenerateToken.validateSessionToken(accessToken);

  if (!valid) {
    resp.statusCode = 401;
    return resp.json({
      data: {},
      success: false,
      message
    });
  }

  const user = new User(await Repo.findOne(User, { where: { id: data } }));

  if (!user.id) {
    resp.statusCode = 401;
    return resp.json({
      data: {},
      success: false,
      message
    });
  }

  req.user = user;

  next();
};

export const RequireAuthMiddleware = {
  init
};
