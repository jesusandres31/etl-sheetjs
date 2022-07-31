import 'dotenv/config';
import pgPromise from 'pg-promise';

const dbConfig = {
  user: process.env.DB_USER,
  host:
    process.env.NODE_ENV === 'development'
      ? process.env.DB_HOST_DEV
      : process.env.DB_HOST_PROD,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT),
};

const pgp = pgPromise();

pgp.pg.types.setTypeParser(20, (value) => {
  return Number(value);
});

export const db = pgp(dbConfig);

export const qrm = pgPromise.queryResult;
