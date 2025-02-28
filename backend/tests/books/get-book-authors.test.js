test('Getting book authors', async () => {
    const id = "8e469169-f161-463e-8887-309fcdc0af54";

    const reply = await global.app.inject({
        method: "GET",
        url:`/api/book/${id}/authors`
    });

    expect(reply.statusCode).toBe(200);

    const authors = JSON.parse(reply.body);
    expect(authors instanceof Array).toBe(true);

    for(const author of authors){
        expect(Object.keys(author).sort()).toEqual(['id', 'name'].sort());
        expect(author.id).not.toBeNull();
        expect(author.name).not.toBeNull();
    }
});

test('Getting non existant book authors', async () => {
    const id = "00000000-0000-0000-0000-000000000000";

    const reply = await global.app.inject({
        method: "GET",
        url:`/api/book/${id}/authors`
    });

    expect(reply.statusCode).toBe(200);

    const authors = JSON.parse(reply.body);
    expect(authors instanceof Array).toBe(true);
    expect(authors).toHaveLength(0);
});

test('Getting book authors with an invalid book id', async () => {
    const id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

    const reply = await global.app.inject({
        method: "GET",
        url:`/api/book/${id}/authors`
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Id');
});

test('Getting book authors with no book id', async () => {
    const reply = await global.app.inject({
        method: "GET",
        url:`/api/book/authors`
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Id');
});