import pool from "./pool.js";

/**
 * loads some data from each relation from the database into the buffer cache of PostgreSQL
 * using pg_prewarm extension.
 * The amount of data loaded is bound by your PostgreSQL configurations such as 
 * shared buffer size and effective cache sizes and some other configurations 
 * 
 */
export default async function(){
    await pool.query(`
        CREATE EXTENSION IF NOT EXISTS pg_prewarm;
        SELECT pg_prewarm('authors'), pg_prewarm('books');
    `);
} 