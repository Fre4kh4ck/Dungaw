/* eslint-disable no-undef */
require('dotenv').config();
const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

module.exports = Object.freeze({ db: db });
