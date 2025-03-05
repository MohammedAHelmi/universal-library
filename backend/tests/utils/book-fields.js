import isNotNull from "../helpers/is-not-null.js";

export const shortSchema = [
    { name: 'id', verify: isNotNull },
    { name: 'title', verify: isNotNull }
];

export const extendedSchema = [
    ...shortSchema,
    { name: 'description' }
];