import isUUID from '../../utils/is-UUID.js';

export default async function(itemsGetter, request, reply){
    const { id } = request.params;
    if(!isUUID(id)){
        return reply
        .code(400)
        .send("Invalid Id");
    }

    const items = await itemsGetter(id);
    if(items == null){
        return reply
        .code(404)
        .send("Item(s) Doesn't Exist");
    }

    reply
    .code(200)
    .send(items);
}