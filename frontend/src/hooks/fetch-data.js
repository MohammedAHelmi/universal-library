import CodedError from '../../../errors/CodedError.js';

export default async function fetchData(url){
    const response = await fetch(url);
    
    if(!response.ok)
        throw new CodedError(response.status, await response.text());
    
    const content = await response.json();
    
    return content;
}