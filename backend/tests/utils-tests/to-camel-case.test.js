import { snakeCaseToCamelCase, snakeCaseObjectKeysToCamelCase } from '../../../utils/to-camel-case.js'

test('test snake_case to camelCase', () => {
    expect(snakeCaseToCamelCase('snake_case')).toBe('snakeCase');
    expect(snakeCaseToCamelCase('2_snake_case')).toBe('2SnakeCase');
    expect(snakeCaseToCamelCase('snake_2_case')).toBe('snake2Case');
});

test('testing object keys to camel case', () => {
    const obj = {
        snake_case_key1: null,
        snake_case_key2: null
    };

    expect(snakeCaseObjectKeysToCamelCase(obj)).toStrictEqual({
        snakeCaseKey1: null,
        snakeCaseKey2: null
    })

})