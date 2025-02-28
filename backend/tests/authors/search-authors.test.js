test('tests search a term', async () => {
    const term = 'Mario';
    const limit = 10;

    const reply = await global.app.inject({
        method: 'GET',
        url : `/api/authors`,
        query: {
            term,
            limit
        }
    });

    expect(reply.statusCode).toBe(200);

    const authors = JSON.parse(reply.body);
    expect(authors.length <= limit).toBe(true);

    for(const author of authors){
        expect(Object.keys(author).sort()).toEqual(['id', 'name'].sort());
        expect(author.id).not.toBeNull();
        expect(author.name).not.toBeNull();
    }
}, 2*60*1000);

test('tests search a term with invalid page', async () => {
    const term = 'Mario';
    const page = -1;
    const limit = 10;

    const reply = await global.app.inject({
        method: 'GET',
        url : `/api/authors`,
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
    const term = 'Mario';
    const page = 2;
    const limit = -10;

    const reply = await global.app.inject({
        method: 'GET',
        url : `/api/authors`,
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
    const term = 'Mario';
    const page = 5;
    const limit = 100;

    const reply = await global.app.inject({
        method: "GET",
        url: "/api/authors",
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
    const term = "Mario";
    const page = 3;
    const limit = 100;

    const reply = await global.app.inject({
        method: "GET",
        url: "/api/authors",
        query: {
            term,
            page,
            limit
        }
    });

    expect(reply.statusCode).toBe(200);

    const authors = await JSON.parse(reply.body);

    expect(authors).toHaveLength(50);
    for(const author of authors){
        expect(Object.keys(author).sort()).toEqual(['id', 'name'].sort());
        expect(author.id).not.toBeNull();
        expect(author.name).not.toBeNull();
    }
}, 2*60*1000);