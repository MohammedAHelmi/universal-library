/**
 * @param {object} searchObject 
 * @returns {string}
 */
export default function(searchObject={}){
    const searchString = Object
    .entries(searchObject)
    .reduce((searchString, [term, value]) => {
        if(value == null) return searchString;
        return searchString + `&${term}=${value}`;
    }, "");

    return searchString !== ''? '?' + searchString.substring(1) : "";
}