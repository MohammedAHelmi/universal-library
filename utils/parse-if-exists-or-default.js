import isString from "./is-string.js";

/**
 * @param {string|String|undefined|null} num
 * @param {number} defaultNum 
 * @returns {number}
 */
export default function(num, defaultNum){
    if(num != null && !isString(num))
        throw new TypeError('Expected a string');

    if(typeof defaultNum !== 'number')
        throw new TypeError('Expected default number to be of type number');

    return + (num || defaultNum);
}