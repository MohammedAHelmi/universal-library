function verifyStatusCode({ statusCode }, code){
    expect(statusCode).toBe(code);
}

export default verifyStatusCode;