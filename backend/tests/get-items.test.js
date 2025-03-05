import sendRequest from './helpers/send-request.js';
import verifyStatusCode from './helpers/verify-status-code.js';
import verifyItem from './helpers/verify-item-schema.js';
import verifyMessage from './helpers/verify-message.js';
import { shortSchema as authorFields } from './utils/author-fields.js';
import { shortSchema as bookFields } from './utils/book-fields.js';
import { INVALID_PAGE, INVALID_LIMIT } from './utils/messages.js';

test
.concurrent
.each([
    {
        name: "Fetching The First Page Of Authors With No Queries",
        path: "/api/authors",
        fields: authorFields
    },
    {
        name: "Fetching The First Page Of Books With No Queries",
        path: "/api/books",
        fields: bookFields
    },
    {
        name: "Fetching The 1000th Page Of Authors",
        path: "/api/authors",
        query: { page: 1000 },
        fields: authorFields
    },
    {
        name: "Fetching The 1000th Page Of Books",
        path: "/api/books",
        query: { page: 1000 },
        fields: bookFields
    },
    {
        name: "Fetching The First Page Of Authors With 10 Authors",
        path: "/api/authors",
        query: { limit: 10 },
        fields: authorFields
    },
    {
        name: "Fetching The First Page Of Books With 10 Books",
        path: "/api/books",
        query: { limit: 10 },
        fields: bookFields
    },
    {
        name: "Fetching The 1000th Page Of Authors With 10 Authors",
        path: "/api/authors",
        query: { page: 1000, limit: 10 },
        fields: authorFields
    },
    {
        name: "Fetching The 1000th Page Of Books With 10 Books",
        path: "/api/books",
        query: { page: 1000, limit: 10 },
        fields: bookFields
    },
    {
        name: "Fetching The 1,000,000th Page Of Authors With 100 Authors",
        path: "/api/authors",
        query: { page: 1_000_000, limit: 100 },
        fields: authorFields
    },
    {
        name: "Fetching The 1,000,000th Page Of Books With 100 Books",
        path: "/api/books",
        query: { page: 1_000_000, limit: 100 },
        fields: bookFields
    },
])("$name", async ({ path, query, fields }) => {
    const reply = await sendRequest(path, query);
    verifyStatusCode(reply, 200);

    const items = JSON.parse(reply.payload);
    expect(items instanceof Array).toBe(true);
    items.forEach(item => verifyItem(item, fields))
});

test
.concurrent
.each([
    {
        name: "Authors Page Number Is Too Small",
        path: "/api/authors",
        query: { page: 0 },
        expectedResponse: INVALID_PAGE
    },
    {
        name: "Books Page Number Is Too Small",
        path: "/api/books",
        query: { page: 0 },
        expectedResponse: INVALID_PAGE
    },
    {
        name: "Authors Page Number Is Not A Number",
        path: "/api/authors",
        query: { page: "two" },
        expectedResponse: INVALID_PAGE
    },
    {
        name: "Books Page Number Is Not A Number",
        path: "/api/books",
        query: { page: "two" },
        expectedResponse: INVALID_PAGE
    },
    {
        name: "Authors Page Limit Is Too Small",
        path: "/api/authors",
        query: { limit: 0 },
        expectedResponse: INVALID_LIMIT
    },
    {
        name: "Books Page Limit Is Too Small",
        path: "/api/books",
        query: { limit: 0 },
        expectedResponse: INVALID_LIMIT
    },
    {
        name: "Authors Page Limit Is Not A Number",
        path: "/api/authors",
        query: { limit: "two" },
        expectedResponse: INVALID_LIMIT
    },
    {
        name: "Books Page Limit Is Not A Number",
        path: "/api/books",
        query: { limit: "two" },
        expectedResponse: INVALID_LIMIT
    },
])("$name", async ({ path, query, expectedResponse }) => {
    const reply = await sendRequest(path, query);
    verifyStatusCode(reply, 400);
    verifyMessage(reply.body, expectedResponse)
});