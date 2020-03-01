const path = require('path');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({
    path: path.resolve(
      __dirname,
      '..',
      `.env.${process.env.NODE_ENV || 'development'}`,
    ),
  });
} else {
  dotenv.config();
}

module.exports = {
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
