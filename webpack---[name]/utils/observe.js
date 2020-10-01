import {
    noop
} from './utils.js';

/**
 * @callback observerCallback
 * @param {PerformanceEntryList} 
 * @param {PerformanceObserver}
 */

/**
 * 
 * @param {function} PerformanceObserver 
 * @param {string} type 
 * @param {observerCallback} [cb = noop] 
 * @param {boolean} [buffered = true]
 * @returns {PerformanceObserver|undefined}
 */
export default function observe(PerformanceObserver, type, cb = noop, buffered = true) {
    if (!PerformanceObserver) {
        return;
    }

    const {
        supportedEntryTypes
    } = PerformanceObserver;
    if (!supportedEntryTypes || !supportedEntryTypes.includes(type)) {
        return;
    }

    const observer = new PerformanceObserver((list, observer) => cb(list.getEntries(), observer));
    try {
        observer.observe({
            type,
            buffered
        });
    } catch (e) {
        observer.observe({
            entryTypes: [type]
        });
    }
    return observer;
}