import isString from '../is-string.js';

test('tests a string type variable', () => {
    expect(isString('string')).toBe(true);
});

test('tests a string instance variable (from the "String" class)', () => {
    expect(isString(new String('string'))).toBe(true);
});

test('tests object', () => {
    expect(isString({})).toBe(false);
});

test('tests number', () => {
    expect(isString(4)).toBe(false);
});

test('tests boolean', () => {
    expect(isString(true)).toBe(false);
});

test('tests null', () => {
    expect(isString(null)).toBe(false);
});

test('tests undefined', () => {
    expect(isString(undefined)).toBe(false);
});

test('tests symbol', () => {
    expect(isString(Symbol("symbol"))).toBe(false);
});