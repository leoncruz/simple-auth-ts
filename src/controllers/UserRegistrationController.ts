import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';

const create = async (req: Request, resp: Response) => {
  const { email, password } = req.body;

  const newUser = new User({ email, password });

  const result = await AppDataSource.manager
    .createQueryBuilder()
    .insert()
    .into(User)
    .values(newUser)
    .orIgnore()
    .returning('*')
    .execute();

  if (Object.keys(result.generatedMaps[0]).length === 0) {
    resp.statusCode = 422;
    return resp.json({ success: false, data: 'invalid data' });
  } else {
    const user = new User(result.generatedMaps[0]);

    return resp.json({ data: user });
  }
};

export const UserRegistrationController = { create };
