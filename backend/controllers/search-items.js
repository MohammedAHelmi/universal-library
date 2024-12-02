import getPageDetails from "./get-page-details.js";

export default async function(itemsSearches, request, reply){
    let pageNumber = null, itemsPerPageLimit = null;
    try{
        const { page, limit } = getPageDetails(request.query);
        pageNumber = page;
        itemsPerPageLimit = limit;
    }
    catch(error){
        return reply
        .code(400)
        .send(error.message)
    }
    
    const { term } = request.query;

    const resultOffset = (pageNumber - 1) * itemsPerPageLimit;
    if(resultOffset >= process.env.MAX_SEARCH_RESULTS){
        return reply
        .code(400)
        .send(`Maximum Results Count Exceeded`);
    }

    //reseting results per page so it does not result in exceeding the maximum result for a search
    itemsPerPageLimit = Math.min(process.env.MAX_SEARCH_RESULTS, itemsPerPageLimit + resultOffset) - resultOffset;

    const results = await itemsSearches(term, resultOffset, itemsPerPageLimit);

    reply
    .code(200)
    .send(results);
}