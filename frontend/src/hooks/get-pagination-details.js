import parseIfExistsOrDefault from '../../../utils/parse-if-exists-or-default.js'
import isPositiveInteger from '../../../utils/is-positive-integer.js';

/**
 * @param {string|object} searchString 
 * @returns {object}
 * @throws {TypeError}
 */
export default function(searchString){
    const urlSearchParamsObj = new URLSearchParams(searchString);
    
    let { page, limit } = Object.fromEntries(urlSearchParamsObj.entries());
    
    page = parseIfExistsOrDefault(page, + process.env.DEFAULT_PAGE);
    limit = parseIfExistsOrDefault(limit, + process.env.DEFAULT_ITEMS_PER_PAGE);
    
    if(!isPositiveInteger(page))
        throw new TypeError('Invalid Page Number');
    
    if(!isPositiveInteger(limit))
        throw new TypeError('Invalid Items Per Page Limit')
    return { page, limit };
}