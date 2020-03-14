import { resolve } from 'path';
import dotenv from 'dotenv';
import { Options } from 'sequelize';

if (process.env.NODE_ENV !== 'production') {
  const path = resolve(__dirname, '..', '..', '.env.');

  dotenv.config({
    path: resolve(`${path}${process.env.NODE_ENV || 'development'}`),
  });
  dotenv.config({
    path: resolve(`${path}local`),
  });
} else {
  dotenv.config();
}

const configuration: Options = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.NODE_ENV === 'production' ? undefined : false,
  define: {
    timestamps: true,
  },
};

export default configuration;
