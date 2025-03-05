import { shortSchema as authorFields } from './utils/author-fields.js';
import { shortSchema as bookFields } from './utils/book-fields.js';
import sendRequest from './helpers/send-request.js';
import verifyStatusCode from './helpers/verify-status-code.js';
import verifyItem from './helpers/verify-item-schema.js';
import verifyMessage from './helpers/verify-message.js';
import { INVALID_PAGE, INVALID_LIMIT, MAX_RESULTS_NUMBER_EXCEEDED } from './utils/messages.js';
import { SEARCH_RESULTS_LIMIT } from './utils/constants.js';

test
.concurrent
.each([
    {
        name: `Fetching Authors With Names Like "Mario" With Invalid Page`,
        path: "/api/authors",
        query: { term: "Mario", page: -1 },
        expectedResponse: INVALID_PAGE
    },
    {
        name: `Fetching Books With Titles Like "Node.js" With Invalid Page`,
        path: "/api/books",
        query: { term: "Node.js", page: -1 },
        expectedResponse: INVALID_PAGE
    },
    {
        name: `Fetching Authors With Names Like "Mario" With Invalid Limit`,
        path: "/api/authors",
        query: { term: "Mario", limit: -10 },
        expectedResponse: INVALID_LIMIT
    },
    {
        name: `Fetching Books With Titles Like "Node.js" With Invalid Limit`,
        path: "/api/books",
        query: { term: "Node.js", limit: -10 },
        expectedResponse: INVALID_LIMIT
    },
    {
        name: `Fetching Authors With Names Like "Mario" Whose Ranks Are All Beyond A Hard-set Limit`,
        path: "/api/authors",
        query: { term: "Mario", page: 2, limit: SEARCH_RESULTS_LIMIT },
        expectedResponse: MAX_RESULTS_NUMBER_EXCEEDED
    },
    {
        name: `Fetching Books With Titles Like "Node.js" Whose Ranks Are All Beyond A Hard-set Limit`,
        path: "/api/books",
        query: { term: "Node.js", page: 2, limit: SEARCH_RESULTS_LIMIT },
        expectedResponse: MAX_RESULTS_NUMBER_EXCEEDED
    },
])("$name", async ({ path, query, expectedResponse }) => {
    const reply = await sendRequest(path, query)
    verifyStatusCode(reply, 400)
    verifyMessage(reply.body, expectedResponse);
});

test
.each([
    {
        name: `Searching For Top 10 Authors With Names Like "Mario"`,
        path: '/api/authors',
        query: { term: 'Mario', limit: 10 },
        MAX_RESULTS: 10,
        fields: authorFields
    },
    {
        name: `Searching For Top 10 Book With Titles Like "Node.js"`,
        path: '/api/books',
        query: { term: 'Node.js', limit: 10 },
        MAX_RESULTS: 10,
        fields: bookFields
    },
    {
        name: `Searching For Authors With Names Like "Mario" With Ranks Between 201 and 300 Or The Hard-set Limit`,
        path: '/api/authors',
        query: { term: 'Mario', page: 3, limit: 100 },
        MAX_RESULTS: 100,
        fields: authorFields
    },
    {
        name: `Searching For Book With Titles Like "Node.js" With Ranks Between 201 and 300 Or The Hard-set Limit`,
        path: '/api/books',
        query: { term: 'Mario', page: 3, limit: 100 },
        MAX_RESULTS: 100,
        fields: bookFields
    }
])("$name", async ({ path, query, MAX_RESULTS, fields }) => {
    const reply = await sendRequest(path, query);
    verifyStatusCode(reply, 200);

    const authors = JSON.parse(reply.body);
    expect(authors instanceof Array).toBe(true);
    expect(authors.length <= MAX_RESULTS).toBe(true);
    authors.forEach(author => verifyItem(author, fields));
}, 2*60*1000);
