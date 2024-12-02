test('tests search a term', async () => {
    const term = 'Node.js Design Patterns';
    const limit = 10;

    const reply = await global.app.inject({
        method: 'GET',
        url : `/api/books`,
        query: {
            term,
            limit
        }
    });

    expect(reply.statusCode).toBe(200);

    const books = JSON.parse(reply.body);
    expect(books.length <= limit).toBe(true);

    for(const book of books){
        expect(Object.keys(book).sort()).toEqual(['id', 'title'].sort());
        expect(book.id).not.toBeNull();
        expect(book.title).not.toBeNull();
    }
}, 2*60*1000);

test('tests search a term with invalid page', async () => {
    const term = 'Node.js Design Patterns';
    const page = -1;
    const limit = 10;

    const reply = await global.app.inject({
        method: 'GET',
        url : `/api/books`,
        query: {
            term,
            page,
            limit
        }
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Page Number');
});

test('tests search a term invalid limit', async () => {
    const term = 'Node.js Design Patterns';
    const page = 2;
    const limit = -10;

    const reply = await global.app.inject({
        method: 'GET',
        url : `/api/books`,
        query: {
            term,
            page,
            limit
        }
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Items Per Page Limit')
});

test('tests searching for exceeding maximum results limit', async () => {
    const term = 'Node.js Design Patterns';
    const page = 5;
    const limit = 100;

    const reply = await global.app.inject({
        method: "GET",
        url: "/api/books",
        query: {
            term,
            page,
            limit
        }
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe("Maximum Results Count Exceeded");
});

test('tests searching for partially exceeding result limit', async () => {
    const term = "Node.js Design Patterns";
    const page = 3;
    const limit = 100;

    const reply = await global.app.inject({
        method: "GET",
        url: "/api/books",
        query: {
            term,
            page,
            limit
        }
    });

    expect(reply.statusCode).toBe(200);

    const books = await JSON.parse(reply.body);

    expect(books).toHaveLength(50);
    for(const book of books){
        expect(Object.keys(book).sort()).toEqual(['id', 'title'].sort());
        expect(book.id).not.toBeNull();
        expect(book.title).not.toBeNull();
    }
}, 2*60*1000);