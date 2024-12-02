/**
 * @param {string|object} searchString 
 * @returns {string|null}
 */
export default function(searchString){
    const urlSearchParamsObj = new URLSearchParams(searchString);
    
    for(const [key, val] of urlSearchParamsObj.entries()){
        if(key !== 'q')
            continue;
        return val;
    }

    return null;
}