import Fastify from 'fastify';
import cors from '@fastify/cors';
import authorsRouter from './routers/authors-router.js';
import booksRouter from './routers/books-router.js';
import style from 'ansi-styles';
import prewarmDB from './data/prewarm-db.js';

import dotEnv from 'dotenv';
import pool from './data/pool.js';
dotEnv.config();

async function setupDefaultHandlers(fastify){
    return fastify
    .setErrorHandler((error, _, reply) => {        
        // notify error at the console
        console.log(`${style.red.open}An Error Occured${style.red.close}`);

        // log the error at the toubleshouting file/stream
        fastify.log.error(error);

        reply
        .code(500)
        .send({ statusCode: 500, error: 'Internal Server Error' });
    })
    .setNotFoundHandler((_, reply) => {
        reply
        .code(404)
        .send({ statusCode: 404, error: `Page Not Found`});
    });
}

async function registerPlugins(fastify) {
    return await Promise.all([
        fastify.register(cors, { origin: true }),
        fastify.register(authorsRouter, { prefix: '/api'}),
        fastify.register(booksRouter, { prefix: '/api' })
    ]);
}

async function setupTerminationHook(fastify){
    fastify.addHook('onClose', async () => {
        await pool.end();
    })
}

async function build(options){
    const fastify = Fastify(options);
    setupDefaultHandlers(fastify);
    setupTerminationHook(fastify);
    await Promise.all([prewarmDB(), registerPlugins(fastify)]);
    return fastify;
}

export default build;