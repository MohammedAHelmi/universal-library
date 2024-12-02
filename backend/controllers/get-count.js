export default async function(countingFn, request, reply){
    const term = request.query.term;

    let count = await countingFn(term);

    if(term != null)
        count = Math.min(count, process.env.MAX_SEARCH_RESULTS);
    
    reply
    .code(200)
    .send(count);
}