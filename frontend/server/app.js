import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import requestHandler from './request-handler.js';
import { join } from 'path';

async function setupPlugins(fastify){
    return await Promise.all[
        fastify.register(fastifyStatic, { root: join(import.meta.dirname, '../', 'public'), prefix: '/public/' })
    ];
}

function setupRequestHandler(fastify){
    return fastify.get('*', requestHandler);
}

async function build(config){
    const fastify = Fastify(config);
    await setupPlugins(fastify);
    setupRequestHandler(fastify);
    return fastify;
}

export default build;