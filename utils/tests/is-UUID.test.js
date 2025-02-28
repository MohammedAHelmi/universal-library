import isUUID from "../is-UUID.js";

test('tests a valid UUID v4', () => {
    expect(isUUID('00000000-0000-0000-0000-000000000000')).toBe(true)
});

test('test UUID v4 with capital hex characters for each part', () => {
    const validUUID = '00000000-0000-0000-0000-000000000000';
    const splitsLocations = [8, 13, 18, 23, 36];

    for(const location of splitsLocations){
        let testUUID = validUUID.substring(0, location-1) + 'F' + validUUID.substring(location);
        expect(isUUID(testUUID)).toBe(true);
    }
});

test('test UUID with small hex character for each part', () => {
    const validUUID = '00000000-0000-0000-0000-000000000000';
    const splitsLocations = [8, 13, 18, 23, 36];

    for(const location of splitsLocations){
        let testUUID = validUUID.substring(0, location-1) + 'f' + validUUID.substring(location);
        expect(isUUID(testUUID)).toBe(true);
    }
});

test('tests a UUID v4 with a prefix', () =>{
    expect(isUUID('-00000000-0000-0000-0000-000000000000')).toBe(false);
});

test('tests a UUID v4 with a postfix', () =>{
    expect(isUUID('00000000-0000-0000-0000-000000000000-')).toBe(false);
});

test('tests a UUID v4 with an extra character for each part', () => {
    const validUUID = '00000000-0000-0000-0000-000000000000';
    const splitsLocations = [8, 13, 18, 23, 36];

    for(const location of splitsLocations){
        const testUUID = validUUID.substring(0, location) + '0' + validUUID.substring(location);
        expect(isUUID(testUUID)).toBe(false);
    }
});

test('tests a UUID v4 with a missing character for each part', () => {
    const validUUID = '00000000-0000-0000-0000-000000000000';
    const splitsLocations = [8, 13, 18, 23, 36];

    for(const location of splitsLocations){
        const testUUID = validUUID.substring(0, location-1) + validUUID.substring(location);
        expect(isUUID(testUUID)).toBe(false);
    }
});


test('tests a UUID v4 with an illegal character for each part', () => {
    const validUUID = '00000000-0000-0000-0000-000000000000';
    const splitsLocations = [8, 13, 18, 23, 36];

    for(const location of splitsLocations){
        const testUUID = validUUID.substring(0, location-1) + 'g' + validUUID.substring(location);
        expect(isUUID(testUUID)).toBe(false);
    }
});

test('tests a UUID v4 with an illegal separator for each part', () => {
    const validUUID = '00000000-0000-0000-0000-000000000000';
    const splitsLocations = [8, 13, 18, 23];

    for(const location of splitsLocations){
        const testUUID = validUUID.substring(0, location-1) + ' ' + validUUID.substring(location+1);
        expect(isUUID(testUUID)).toBe(false);
    }
});

test('tests a non string value', () => {
    expect(() => isUUID(1000)).toThrow(TypeError);
});