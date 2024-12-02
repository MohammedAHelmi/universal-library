test('getting an author by id', async () => {
    const authorId = '8a786c7d-1554-4d97-a85b-8cfc5c2143b0';
    
    const reply = await global.app.inject({
        method: 'GET',
        url: `/api/author/${authorId}`
    });

    expect(reply.statusCode).toBe(200);

    const body = JSON.parse(reply.body);
    
    expect(Object.keys(body).sort()).toEqual(['id', 'name', 'bio'].sort());
    expect(body.id).not.toBeNull();
    expect(body.name).not.toBeNull();
});

test('getting a non-existant author by id', async () => {
    const authorId = '00000000-0000-0000-0000-000000000000';
    
    const reply = await global.app.inject({
        method: 'GET',
        url: `/api/author/${authorId}`
    });

    expect(reply.statusCode).toBe(404);
    expect(reply.body).toBe(`Item(s) Doesn't Exist`);
});

test('getting an author by invalid id', async () => {
    const authorId = '00000000-000x-0000-0000-000000000000';
    
    const reply = await global.app.inject({
        method: 'GET',
        url: `/api/author/${authorId}`
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Id');
});

test('getting an author by no id', async () => {
    const reply = await global.app.inject({
        method: 'GET',
        url: `/api/author/`
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Id');
});