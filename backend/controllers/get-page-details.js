import parseIfExistsOrDefault from '../../utils/parse-if-exists-or-default.js';
import isPositiveInteger from '../../utils/is-positive-integer.js';

function getPageDetails(query){
    const { page, limit } = query;

    const pageNumber = parseIfExistsOrDefault(page, +process.env.DEFAULT_PAGE);
    if(!isPositiveInteger(pageNumber))
        throw new Error(`Invalid Page Number`);

    const itemsPerPageLimit = parseIfExistsOrDefault(limit, +process.env.DEFAULT_ITEMS_PER_PAGE);
    if(!isPositiveInteger(itemsPerPageLimit))
        throw new Error(`Invalid Items Per Page Limit`);

    return { page: pageNumber, limit: itemsPerPageLimit };
}

export default getPageDetails;