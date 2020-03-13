const { resolve } = require('path');
const dotenv = require('dotenv');

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

module.exports = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  define: {
    logging: true,
    timestamps: true,
    underscored: true,
  },
};
