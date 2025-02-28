test('getting first page with no queries', async () => {
    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/books'
    });

    expect(reply.statusCode).toBe(200);

    const books = JSON.parse(reply.payload);
    expect(books instanceof Array).toBe(true);

    for(const book of books){
        expect(Object.keys(book).sort()).toEqual(['id', 'title', 'description'].sort());
        expect(book.id).not.toBeNull();
        expect(book.title).not.toBeNull();
    }
});

test('getting the 1000th page', async () => {
    const page = 1000;

    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/books',
        query: { page }
    });
    
    expect(reply.statusCode).toBe(200);

    const books = JSON.parse(reply.payload);
    expect(books instanceof Array).toBe(true);

    for(const book of books){
        expect(Object.keys(book).sort()).toEqual(['id', 'title', 'description'].sort());
        expect(book.id).not.toBeNull();
        expect(book.title).not.toBeNull();
    }
});

test('getting the 1st page with 10 books', async () => {
    const limit = 10;

    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/books',
        query: { limit }
    });

    expect(reply.statusCode).toBe(200);
    
    const books = JSON.parse(reply.payload);
    expect(books instanceof Array).toBe(true);
    expect(books.length <= 10).toBe(true);

    for(const book of books){
        expect(Object.keys(book).sort()).toEqual(['id', 'title', 'description'].sort());
        expect(book.id).not.toBeNull();
        expect(book.title).not.toBeNull();
    }
});

test('getting invalid page', async () => {
    const page = 0;

    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/books',
        query: { page }
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Page Number');
});

test('getting invalid limit', async () => {
    const limit = 0;

    const reply = await global.app.inject({
        method: 'GET',
        url: '/api/books',
        query: { limit }
    });

    expect(reply.statusCode).toBe(400);
    expect(reply.body).toBe('Invalid Items Per Page Limit');
});