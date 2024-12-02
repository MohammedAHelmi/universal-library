import isPositiveInteger from "../../../utils/is-positive-integer.js";

test('tests a positive integer', () => {
    expect(isPositiveInteger(10)).toBe(true);
});

test('tests zero', () => {
    expect(isPositiveInteger(0)).toBe(false);
});

test('tests a negative number', () => {
    expect(isPositiveInteger(-1)).toBe(false);
});

test('tests a positive fraction', () => {
    expect(isPositiveInteger(1.5)).toBe(false);
});

test('tests infinity', () => {
    expect(isPositiveInteger(Infinity)).toBe(false);
});