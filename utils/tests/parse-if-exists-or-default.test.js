import parseIfExistsOrDefault from "../parse-if-exists-or-default.js";


test('tests parsing a string that is number', () => {
    expect(parseIfExistsOrDefault('10', 1)).toBe(10);
});

test('tests parsing an empty string', () => {
    expect(parseIfExistsOrDefault('', 1)).toBe(1);
});

test('tests parsing a string that is not a number', () => {
    expect(parseIfExistsOrDefault('a', 1)).toBeNaN();
});

test('tests parsing non string value', () => {
    expect(() => parseIfExistsOrDefault(1, 1)).toThrow(TypeError);
});

test('tests parsing non number default', () => {
    expect(() => parseIfExistsOrDefault('1', '1')).toThrow(TypeError);
});