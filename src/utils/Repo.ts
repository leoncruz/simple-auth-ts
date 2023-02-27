import { AppDataSource } from '../data-source';

const insert = async <T>(entity: any, values: any): Promise<null | T> => {
  const result = await AppDataSource.manager
    .createQueryBuilder()
    .insert()
    .into(entity)
    .values(values)
    .orIgnore() // this is for do nothing when unique constraint violation occours
    .returning('*')
    .execute();

  if (Object.keys(result.generatedMaps[0]).length === 0) return null;

  return result.generatedMaps[0] as T;
};

const update = async (
  entity: any,
  id: number,
  values: any
): Promise<null | boolean> => {
  const result = await AppDataSource.manager.update(entity, id, values);

  return !!result.affected;
};

const findOne = async (entity: any, values: any) => {
  return await AppDataSource.manager.findOne(entity, values);
};

export const Repo = {
  insert,
  update,
  findOne
};
