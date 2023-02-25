import { Request, Response } from 'express';
import { Confirmation } from '../accounts/Confirmation';

const create = async (req: Request, resp: Response) => {
  const { email } = req.body;

  const { success, message } = await Confirmation.sendConfirmationAccountToken(
    email
  );

  if (!success) {
    resp.statusCode = 401;
    return resp.json({ data: {}, success: false, message });
  }

  resp.statusCode = 200;
  resp.json({ data: {}, success: true, message });
};

const update = async (req: Request, resp: Response) => {
  const { token } = req.body;

  const { success, message } = await Confirmation.confirmAccountToken(token);

  if (!success) {
    resp.statusCode = 401;
    return resp.json({ data: {}, message, success });
  }

  resp.statusCode = 200;
  resp.json({ data: {}, success, message });
};

export const UserConfirmationController = {
  update,
  create
};
