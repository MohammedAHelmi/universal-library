import isString from "./is-string.js";

/**
 * 
 * @param {string} id 
 * @returns {boolean}
 * @throws {TypeError}
 */

export default (id) => {
    if(!isString(id))
        throw new TypeError(`Expected id to be a string`);
    
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}