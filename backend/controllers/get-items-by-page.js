import getPageDetails from "./get-page-details.js";

export default async function(itemsGetter, request, reply){
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

    itemsPerPageLimit = Math.min(itemsPerPageLimit, process.env.MAX_ITEMS_PER_PAGE);

    const firstRowNum = (pageNumber - 1) * itemsPerPageLimit + 1;
    const lastRowNum = pageNumber * itemsPerPageLimit;

    const items = await itemsGetter(firstRowNum, lastRowNum);

    reply
    .code(200)
    .send(items);
}