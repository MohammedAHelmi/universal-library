test('Getting author books', async () => {
    const id = "8a786c7d-1554-4d97-a85b-8cfc5c2143b0";

    const reply = await global.app.inject({
        method: "GET",
        url:`/api/author/${id}/books`
    });

    expect(reply.statusCode).toBe(200);

    const books = JSON.parse(reply.body);
    expect(books instanceof Array).toBe(true);

    for(const book of books){
        expect(Object.keys(book).sort()).toEqual(['id', 'title'].sort());
        expect(book.id).not.toBeNull();
        expect(book.title).not.toBeNull();
    }
});

test('Getting non existant author books', async () => {
    const id = "00000000-0000-0000-0000-000000000000";

    const reply = await global.app.inject({
        method: "GET",
        url:`/api/author/${id}/books`
    });

    expect(reply.statusCode).toBe(200);

    const books = JSON.parse(reply.body);
    expect(books instanceof Array).toBe(true);
    expect(books).toHaveLength(0);
});

test('Getting author books with an invalid author id', async () => {
    const id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

    const reply = await global.app.inject({
        method: "GET",
        url:`/api/author/${id}/books`
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Id');
});

test('Getting author books with no author id', async () => {
    const reply = await global.app.inject({
        method: "GET",
        url:`/api/author/books`
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Id');
});