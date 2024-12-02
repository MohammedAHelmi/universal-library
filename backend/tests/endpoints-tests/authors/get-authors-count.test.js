test('Tests number of all authors', async () => {
    const reply = await global.app.inject({
        method: "GET",
        url: "/api/authors/count"
    });
    expect(reply.statusCode).toBe(200);

    const count = await JSON.parse(reply.body);
    expect(count).toBe(13650184)
});

test('Tests number of authors similar to one', async () => {
    const reply = await global.app.inject({
        method: "GET",
        url: "/api/authors/count",
        query: {
            term: "Mario"
        }
    });
    expect(reply.statusCode).toBe(200);

    const count = await JSON.parse(reply.body);
    expect(count <= 250).toBe(true);
}, 2*60*1000);