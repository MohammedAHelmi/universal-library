import buildSearchString from "./build-search-string.js";
/**
 * @param {string} baseURL 
 * @param {string} path 
 * @param {object} query
 * @returns {string}
 */
function buildURL(baseURL, path='', searchObj={}){
    return baseURL + path + buildSearchString(searchObj);
}

export default buildURL;