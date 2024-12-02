import build from "../app.js";
import { join } from 'path';

export default async function(){
    const app = await build({
        logger: {
            level: 'warn',
            file: join(import.meta.dirname, 'errors.txt') 
        }
    });

    await app.ready();

    global.__APP__ = app;
}