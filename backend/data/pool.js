import Pg from 'pg';

import dotEnv from 'dotenv';
dotEnv.config();

export default new Pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: +process.env.MAX_DB_CONNECTIONS
});