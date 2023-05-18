import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
const configDB = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: configDB.type,
  host: configDB.host,
  port: +configDB.port,
  username: configDB.username,
  password: configDB.password,
  database: configDB.database,
  schema: configDB.schema,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: configDB.synchronize,
};

export default config;
