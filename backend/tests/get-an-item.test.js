import { extendedSchema as authorFields } from './utils/author-fields.js';
import { extendedSchema as bookFields } from './utils/book-fields.js';
import sendRequest from './helpers/send-request.js';
import verifyStatusCode from './helpers/verify-status-code.js';
import verifyItem from './helpers/verify-item-schema.js';
import verifyMessage from './helpers/verify-message.js';
import { DO_NOT_EXIST, INVALID_ID } from './utils/messages.js';

test
.concurrent
.each([
    {
        name: 'Valid Author ID',
        path: `/api/author/8a786c7d-1554-4d97-a85b-8cfc5c2143b0`,
        fields: authorFields
    },
    {
        name: 'Valid Book ID',
        path: `/api/book/8e469169-f161-463e-8887-309fcdc0af54`,
        fields: bookFields
    }
])('$name', async ({ path, fields }) => {
    const reply = await sendRequest(path);
    verifyStatusCode(reply, 200);
    
    const body = JSON.parse(reply.body);
    verifyItem(body, fields);
});

test
.concurrent
.each([
    { name: "Get A Non-existant Author", path: '/api/author/00000000-0000-0000-0000-000000000000' },
    { name: "Get A Non-existant Book", path: '/api/book/00000000-0000-0000-0000-000000000000'}
])("$name", async ({ path }) => {
    const reply = await sendRequest(path)
    verifyStatusCode(reply, 404);
    verifyMessage(reply.body, DO_NOT_EXIST);
});

test
.concurrent
.each([
    { 
        name: 'Invalid Author UUID Characters',
        path:  '/api/author/00000000-000x-0000-0000-000000000000'
    },
    { 
        name: 'Invalid Book UUID Characters',
        path:  '/api/book/00000000-000x-0000-0000-000000000000'
    },
    { 
        name: 'Invalid Author UUID Format',
        path:  '/api/author/00000000-000-0000-0000-000000000000'
    },
    { 
        name: 'Invalid Book UUID Characters',
        path:  '/api/book/00000000-000-0000-0000-000000000000'
    },
    { 
        name: 'Normal String As Author ID',
        path:  '/api/author/id'
    },
    { 
        name: 'Normal String As Book ID',
        path:  '/api/book/id'
    },
    { 
        name: 'No Author ID',
        path:  '/api/author/'
    },
    { 
        name: 'No Book ID',
        path:  '/api/book/'
    }
])("$name", async ({ path }) => {
    const reply = await sendRequest(path);
    verifyStatusCode(reply, 400)
    verifyMessage(reply.body, INVALID_ID);
});