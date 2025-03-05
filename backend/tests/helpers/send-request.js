async function sendRequest(path, query) {
    return await global.app.inject({
        method: "GET",
        url: path,
        query
    });
}

export default sendRequest;