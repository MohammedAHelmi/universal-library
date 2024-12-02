/**
 * @param {Function} fn 
 * @returns {Function}
 */
export default function(fn){
    return async function(...args){
        try{
            return await fn(...args);
        }
        catch(error){
            return error
        }
    }
}