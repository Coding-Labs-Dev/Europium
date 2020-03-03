import { resolve } from 'path';
import dotenv from 'dotenv';
import { Options } from 'sequelize';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: resolve(
      __dirname,
      '..',
      '..',
      `.env.${process.env.NODE_ENV || 'development'}`,
    ),
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
  define: {
    timestamps: true,
    underscored: true,
  },
};

export default configuration;
