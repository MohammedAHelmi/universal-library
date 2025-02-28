test('Testing Count is correct', async () => {
    const reply = await global.app.inject({
        method: "GET",
        url: "/api/books/count"
    });
    expect(reply.statusCode).toBe(200);

    const count = await JSON.parse(reply.body);
    expect(count).toBe(37758636)
});

test('Tests number of books similar to one', async () => {
    const reply = await global.app.inject({
        method: "GET",
        url: "/api/books/count",
        query: {
            term: "node.js"
        }
    });
    expect(reply.statusCode).toBe(200);

    const count = await JSON.parse(reply.body);
    expect(count <= 250).toBe(true);
}, 2*60*1000);