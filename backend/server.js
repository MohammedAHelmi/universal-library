import build from "./app.js";
import { join } from 'path';
import style from 'ansi-styles';

const app = await build({
    logger: {
        level: 'warn',
        file: join(import.meta.dirname, 'troubleshoot/server.txt') 
    }
});

const port = process.env.BACKEND_PORT;
app.listen({ port }, (err, address) => {
    if(err)
        throw err;
    console.log(`${style.cyan.open}server is now listening on ${address}${style.cyan.close}`);
});