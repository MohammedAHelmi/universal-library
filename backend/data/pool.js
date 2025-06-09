import Pg from 'pg';

import dotEnv from 'dotenv';
dotEnv.config();

export default new Pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: +process.env.MAX_DB_CONNECTIONS
});