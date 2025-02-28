import { join } from 'path';
import {TestEnvironment as NodeEnvironment} from 'jest-environment-node';
import buildApp from '../../app.js'; 

class CustomEnvironment extends NodeEnvironment{
    async setup(){
        await super.setup();
        this.global.app = await buildApp({
            logger: {
                level: 'warn',
                file: join(import.meta.dirname, '..', 'troubleshoot', 'errors.txt') 
            }
        });
    }

    async teardown(){
        await this.global.app.close();
        await super.teardown();
    }
}

export default CustomEnvironment;