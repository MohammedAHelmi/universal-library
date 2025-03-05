import { shortSchema as authorFields } from './utils/author-fields.js';
import { shortSchema as bookFields } from './utils/book-fields.js';
import sendRequest from './helpers/send-request.js';
import verifyStatusCode from './helpers/verify-status-code.js';
import verifyItem from './helpers/verify-item-schema.js';
import verifyMessage from './helpers/verify-message.js';
import { INVALID_ID } from './utils/messages.js';

test
.concurrent
.each([
    {
        name: "Get Author's Books With Valid Author ID",
        path: '/api/author/8a786c7d-1554-4d97-a85b-8cfc5c2143b0/books',
        fields: bookFields
    },
    {
        name: "Get Book's Authors With Valid Book ID",
        path: '/api/book/8e469169-f161-463e-8887-309fcdc0af54/authors',
        fields: authorFields
    }
])("$name", async ({ path, fields }) => {
    const reply = await sendRequest(path);
    verifyStatusCode(reply, 200);

    const body = JSON.parse(reply.body);
    expect(body instanceof Array).toBe(true);
    body.forEach(item => verifyItem(item, fields));
});


test
.concurrent
.each([
    { 
        name: "Getting Books For An Author Who Doesn't Exist",
        path: '/api/author/00000000-0000-0000-0000-000000000000/books'
    },
    { 
        name: "Getting Authors For A Book Which Doesn't Exist",
        path: '/api/book/00000000-0000-0000-0000-000000000000/authors'
    }
])("$name", async ({ path }) => {
    const reply = await sendRequest(path)
    verifyStatusCode(reply, 200);

    const body = JSON.parse(reply.body);
    expect(body instanceof Array).toBe(true);
    expect(body).toHaveLength(0);
});

test
.concurrent
.each([
    { 
        name: 'Invalid Author UUID Characters',
        path:  '/api/author/00000000-000x-0000-0000-000000000000/books'
    },
    { 
        name: 'Invalid Book UUID Characters',
        path:  '/api/book/00000000-000x-0000-0000-000000000000/authors'
    },
    { 
        name: 'Invalid Author UUID Format',
        path:  '/api/author/00000000-000-0000-0000-000000000000/books'
    },
    { 
        name: 'Invalid Book UUID Characters',
        path:  '/api/book/00000000-000-0000-0000-000000000000/authors'
    },
    { 
        name: 'Normal String As Author ID',
        path:  '/api/author/id/books'
    },
    { 
        name: 'Normal String As Book ID',
        path:  '/api/book/id/authors'
    },
    { 
        name: 'No Author ID',
        path:  '/api/author/books'
    },
    { 
        name: 'No Book ID',
        path:  '/api/book/authors'
    }
])("$name", async ({ path }) => {
    const reply = await sendRequest(path);
    verifyStatusCode(reply, 400);
    verifyMessage(reply.body, INVALID_ID);
});