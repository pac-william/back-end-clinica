import * as dotenv from 'dotenv';
import type { Knex } from 'knex';
import path, { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../.env') });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME
    },
    migrations: {
      extension: 'ts',
      directory: path.resolve(__dirname, 'migrations')
    },
    seeds: {
      extension: 'ts',
      directory: path.resolve(__dirname, 'seeds')
    },
    useNullAsDefault: true
  }
};

export default config;