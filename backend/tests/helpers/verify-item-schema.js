function verifyItem(obj, fields){
    verifyFieldNames(obj, fields);
    verifyFieldConstraints(obj, fields);
}

function verifyFieldNames(obj, fields){
    const actualFieldNames = Object.keys(obj);
    const expectedFieldNames = fields.map(field => field.name);
    expect(actualFieldNames.sort()).toEqual(expectedFieldNames.sort());
}

function verifyFieldConstraints(obj, fields){
    for(const field of fields){
        const { name, verify } = field;

        if(typeof verify !== 'function')
            continue;

        expect(verify(obj[name])).toBe(true);
    }
}

export default verifyItem;