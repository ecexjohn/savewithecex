import {
    MARKER
} from './constants.js';

/**
 * @typedef {[Window,Performance,function,((handler:TimerHandler,timeout?:number) => number),((handle:number) => void)]} State
 */

export function noop() {}

export const label = s => `${MARKER}${s}`;

export const {
    round,
    max,
    min
} = Math;

export function rejector(value) {
    return () => Promise.reject(value);
}

function isType(type) {
    return v => typeof v === type;
}
export const isUndefined = isType('undefined');
export const isNumber = isType('number');
export const isBoolean = isType('boolean');
export const isString = isType('string');

/**
 * Return the first entry for an entry type, if it exists
 * @param {Performance} performance 
 * @param {string} entryType 
 * @returns {PerformanceEntry|undefined}
 */
export function getFirstEntryByType(performance, entryType) {
    return performance.getEntriesByType ? .(entryType) ? .[0];
}

/**
 * Extracts a field value from a promise return
 * @param {Promise} promise 
 * @param {string|number} field 
 */
export function extract(promise, field) {
    return promise.then(({
        [field]: value
    }) => value);
}

/**
 * Finish function factory
 * @template T
 * @param {Array<T>} cbs 
 * @param {T} cb 
 * @param {() => void} terminate
 */
export function handleFinish(cbs, cb, terminate) {
    return () => {
        const index = cbs.indexOf(cb);
        if (index > -1) {
            cbs.splice(index, 1);
            if (cbs.length === 0) {
                terminate();
            }
        }
    };
}

/**
 * Create disconnect handler
 * @param {PerformanceObserver} observer 
 */
export function disconnectHandler(observer) {
    return () => observer.disconnect();
}

/**
 * Get id of closest containing ancestor that has an id, or id param if provided
 * @param {Element} element 
 * @param {string} [id] 
 * @returns {string|undefined}
 */
export function closestId(element, id) {
    if (isString(id)) {
        return id;
    }
    const closest = element && element.closest('*[id]');
    if (closest) {
        return closest.id;
    }
}

/**
 * Add field value to property bag, coercing to boolean if name starts with "is"
 * @param {Object} target 
 * @param {string} key 
 * @param {*} value 
 */
export function addField(target, key, value) {
    if (!isUndefined(value)) {
        target[key] = /^is/.test(key) ? !!value : value;
    }
}

/**
 * Waits until all promises are settled, and return promise with fulfilled values
 * @template T
 * @param {Promise<T>[]} promises 
 * @returns {Promise<T[]>}
 */
export function allFulfilled(promises) {
    return Promise.allSettled(promises).then(results => results
        .filter(({
            status
        }) => status === 'fulfilled')
        .map(({
            value
        }) => value));
}

/**
 * Combine multiple fulfilled entries into a single entry
 * @param {string} entryType 
 * @param  {...Promise} promises 
 */
export function batch(entryType, ...promises) {
    return new Promise(resolve => {
        allFulfilled(promises).then(values => {
            const result = values.reduce((acc, value) => Object.assign(acc, value), {});
            result.entryType = entryType;
            resolve(result);
        });
    });
}