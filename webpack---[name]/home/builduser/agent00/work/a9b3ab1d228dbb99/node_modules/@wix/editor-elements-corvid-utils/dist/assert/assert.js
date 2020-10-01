var emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
export function isNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value);
}
export function isString(value) {
    return typeof value === 'string';
}
export function isBoolean(value) {
    return value === true || value === false;
}
export function isDate(value) {
    return value instanceof Date && !Number.isNaN(value.getTime());
}
export function isFunction(value) {
    return typeof value === 'function';
}
export function isArray(value) {
    return Array.isArray(value);
}
export function isObject(value) {
    return typeof value === 'object' && value !== null && !isArray(value);
}
export function isInteger(value) {
    return Number.isInteger(value);
}
export function isNil(value) {
    return value === null || value === undefined;
}
export function isIn(value, arr) {
    return arr.includes(value);
}
export function isAbove(value, limit) {
    return value > limit;
}
export function isBelow(value, limit) {
    return value < limit;
}
export function isEmail(value) {
    return emailRegExp.test(value);
}
export function is(value, predicates) {
    return predicates.every(function(p) {
        return p(value);
    });
}
//# sourceMappingURL=assert.js.map