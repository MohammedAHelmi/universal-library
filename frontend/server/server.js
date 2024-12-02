import build from './app.js';
import dotEnv from 'dotenv';
import { join } from 'path';

dotEnv.config({ 
    path: ['.env', join(import.meta.dirname, '../configs/.env.frontend')] 
});

const app = await build({
    logger: {
        level: 'warn' 
    }
});

const port = process.env.FRONTEND_PORT;
app.listen({ port }, (err, address) => {
    if(err)
        throw err;
    console.log(`server is now listening on ${address}`);
});