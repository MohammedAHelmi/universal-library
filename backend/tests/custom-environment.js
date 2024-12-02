import { createRequire } from 'module'

const require = createRequire(import.meta.url);
const NodeEnvironment = require('jest-environment-node').TestEnvironment;

class CustomEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup();
        this.global.app = global.__APP__;
    }

    async teardown() {
        await super.teardown();
    }
}

export default CustomEnvironment;