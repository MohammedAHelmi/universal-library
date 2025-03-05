import sendRequest from './helpers/send-request.js';
import verifyStatusCode from './helpers/verify-status-code.js';
import { AUTHORS_COUNT, BOOKS_COUNT, SEARCH_RESULTS_LIMIT } from './utils/constants.js';

test
.concurrent
.each([
    {
        name: "Number Of All Authors",
        expectedCount: AUTHORS_COUNT,
        path: "/api/authors/count"
    },
    {
        name: "Number Of All Books",
        expectedCount: BOOKS_COUNT,
        path: "/api/books/count"
    }
])("$name", async ({ expectedCount, path }) => {
    const reply = await sendRequest(path);
    verifyStatusCode(reply, 200);
    
    const count = parseInt(reply.body);
    expect(count).toBe(expectedCount);
});


test
.each([
    {
        name: 'Number Of Author Names Similar to "MARIO"',
        path: '/api/books/count',
        query: { term: 'Mario'},
        MAX_RESULT: SEARCH_RESULTS_LIMIT
    },
    {
        name: 'Number Of Book Titles Similar to "node.js"',
        path: '/api/books/count',
        query: { term: 'node.js'},
        MAX_RESULT: SEARCH_RESULTS_LIMIT
    }
])("$name", async ({ path, query, MAX_RESULT }) => {
    const reply = await sendRequest(path, query);
    verifyStatusCode(reply, 200);

    const count = parseInt(reply.body);
    expect(count <= MAX_RESULT).toBe(true);
}, 2*60*1000);