/* eslint-disable no-undef */
require('dotenv').config();
const { drizzle } = require('drizzle-orm/mysql2');

const db = drizzle(process.env.DATABASE_URL);

module.exports = Object.freeze({ db: db });
