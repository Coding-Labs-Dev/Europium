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
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DB_NAME || 'email_extractor',
  logging: process.env.NODE_ENV === 'test' ? false : undefined,
  define: {
    timestamps: true,
  },
};

export default configuration;
