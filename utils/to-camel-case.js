import isString from "./is-string.js";

/**
 * @param {string|String} str 
 * @returns {string}
 * @throws {TypeError}
 */
export function snakeCaseToCamelCase(str){
    if(!isString(str))
        throw new TypeError('Expected a string');

    str = str.replace(/[-_]([a-z0-9])/gi, (_, l) => l.toUpperCase());
    str = str[0].toLowerCase() + str.substring(1);
    return str;
}

/**
 * @param {Object} obj 
 * @returns {Object}
 * @throws {TypeError}
 */
export function snakeCaseObjectKeysToCamelCase(obj){
    if(typeof obj !== 'object')
        throw new TypeError(`Excepted an Object`);

    const newObj = {}
    
    for(const key in obj){
        const camelCaseKey = snakeCaseToCamelCase(key);
        newObj[camelCaseKey] = obj[key];
    }

    return newObj;
}