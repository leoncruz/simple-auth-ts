import { Request, Response } from 'express';

const index = (req: Request, resp: Response) => {
  resp.json({ user: req.user });
};

export const PostController = {
  index
};
