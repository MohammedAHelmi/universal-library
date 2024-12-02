import asyncThrowingToErrorAsValue from '../../../utils/async-throwing-to-error-as-value.js';

test("testing Error throwing function", async () => {
    const fn = async () => {
        throw new Error();
    }

    const nonThrowingFn = asyncThrowingToErrorAsValue(fn);
    const result = await nonThrowingFn();
    expect(result instanceof Error).toBe(true);
});

test("testing error returning function", async () => {
    const fn = async () => new Error();

    const nonThrowingFn = asyncThrowingToErrorAsValue(fn);
    const result = await nonThrowingFn();
    expect(result instanceof Error).toBe(true);
});

test("testing a function that has no errors", async () => {
    const fn = async () => 5;

    const nonThrowingFn = asyncThrowingToErrorAsValue(fn);
    const result = await nonThrowingFn();
    expect(result instanceof Error).toBe(false);
});