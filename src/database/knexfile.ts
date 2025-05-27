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
      database: process.env.DB_NAME,
      ssl: process.env.SSL_ENABLED === 'true' ? { rejectUnauthorized: false } : false
    },
    migrations: {
      extension: 'ts',
      directory: path.resolve(__dirname, 'migrations')
    },
    seeds: {
      extension: 'ts',
      directory: path.resolve(__dirname, 'seeds')
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10,
      afterCreate: (conn: any, done: any) => {
        conn.query(`SET search_path TO ${process.env.DB_SCHEMA || 'public'}`, (err: any) => {
          done(err, conn);
        });
      }
    }
  }
};

export default config;