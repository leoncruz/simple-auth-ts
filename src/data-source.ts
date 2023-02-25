import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  database: 'simple_auth_ts_dev',
  logging: false,
  entities: [`${__dirname}/entities/**/*.ts`],
  migrations: [`${__dirname}/migrations/**/*.ts`]
});
