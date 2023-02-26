import { NextFunction, Request, Response } from 'express';
import { GenerateToken } from './GenerateToken';

const init = (req: Request, resp: Response, next: NextFunction) => {
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

  next();
};

export const RequireAuthMiddleware = {
  init
};
