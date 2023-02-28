import { Request, Response } from 'express';
import { ResetPassword } from '../accounts/ResetPassword';

const create = async (req: Request, resp: Response) => {
  const { email } = req.body;

  const { success, message } = await ResetPassword.createResetPasswordToken(
    email
  );

  if (!success) {
    resp.statusCode = 401;
    return resp.json({ data: {}, success, message });
  }

  resp.statusCode = 200;
  resp.json({ data: {}, success, message });
};

const validate = async (req: Request, resp: Response) => {
  const { token } = req.body;

  const { success, message, newResetToken } =
    await ResetPassword.validateResetPasswordToken(token);

  if (!success) {
    resp.statusCode = 401;
    return resp.json({ data: {}, message, success });
  }

  resp.statusCode = 200;
  resp.json({ data: { toke: newResetToken }, message, success });
};

const update = async (req: Request, resp: Response) => {
  const { email, password, reset_token: resetToken } = req.body;

  const { success, message } = await ResetPassword.update(
    email,
    password,
    resetToken
  );

  if (!success) {
    resp.statusCode = 400;
    return resp.json({ data: {}, success, message });
  }

  resp.statusCode = 200;
  resp.json({ data: {}, success, message });
};

export const UserResetPasswordController = {
  create,
  validate,
  update
};
