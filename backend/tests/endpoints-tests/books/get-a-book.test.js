test('getting a book by id', async () => {
    const bookId = '8e469169-f161-463e-8887-309fcdc0af54';
    
    const reply = await global.app.inject({
        method: 'GET',
        url: `/api/book/${bookId}`
    });

    expect(reply.statusCode).toBe(200);

    const body = JSON.parse(reply.body);

    expect(Object.keys(body).sort()).toEqual(['id', 'title', 'description'].sort());
    
    expect(body.id).not.toBeNull();
    expect(body.title).not.toBeNull();
});

test('getting a non-existant book by id', async () => {
    const bookId = '00000000-0000-0000-0000-000000000000';
    
    const reply = await global.app.inject({
        method: 'GET',
        url: `/api/book/${bookId}`
    });

    expect(reply.statusCode).toBe(404);
    expect(reply.body).toBe(`Item(s) Doesn't Exist`);
});

test('getting a book by invalid id', async () => {
    const bookId = '00000000-000x-0000-0000-000000000000';
    
    const reply = await global.app.inject({
        method: 'GET',
        url: `/api/book/${bookId}`
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Id');
});

test('getting a book by no id', async () => {
    const reply = await global.app.inject({
        method: 'GET',
        url: `/api/book/`
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Id');
});