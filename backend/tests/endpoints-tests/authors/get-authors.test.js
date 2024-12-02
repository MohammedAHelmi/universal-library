test('getting first page with no queries', async () => {
    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/authors'
    });
    expect(reply.statusCode).toBe(200);

    const authors = JSON.parse(reply.payload);
    expect(authors instanceof Array).toBe(true);
    
    for(const author of authors){
        expect(Object.keys(author).sort()).toEqual(['id', 'name', 'bio'].sort());
        expect(author.id).not.toBeNull();
        expect(author.name).not.toBeNull();
    }
});

test('getting the 1000th page', async () => {
    const page = 1000;

    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/authors',
        query: { page }
    });
    
    expect(reply.statusCode).toBe(200);

    const authors = JSON.parse(reply.payload);

    expect(authors instanceof Array).toBe(true);
    for(const author of authors){
        expect(Object.keys(author).sort()).toEqual(['id', 'name', 'bio'].sort());
        expect(author.id).not.toBeNull();
        expect(author.name).not.toBeNull();
    }
});

test('getting the 1st page with 10 authors', async () => {
    const limit = 10;

    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/authors',
        query: { limit }
    });

    expect(reply.statusCode).toBe(200);

    const authors = JSON.parse(reply.payload);

    expect(authors instanceof Array).toBe(true);
    expect(authors.length <= 10).toBe(true);
    for(const author of authors){
        expect(Object.keys(author).sort()).toEqual(['id', 'name', 'bio'].sort());
        expect(author.id).not.toBeNull();
        expect(author.name).not.toBeNull();
    }
});

test('getting invalid page', async () => {
    const page = 0;

    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/authors',
        query: { page }
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Page Number');
});

test('getting invalid limit', async () => {
    const limit = 0;

    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/authors',
        query: { limit }
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Items Per Page Limit');
});