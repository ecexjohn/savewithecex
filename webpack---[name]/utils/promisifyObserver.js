import observe from './observe.js';
import {
    disconnectHandler
} from './utils.js';

/**
 * @callback promisifiedObserverCallback
 * @param {PerformanceEntryList} entries 
 * @param {(r:*) => void} finish - and report
 * @returns {void}
 */

/**
 * Wrap PerformanceObserver in a promise
 * @param {function} PerformanceObserver 
 * @param {string} entryType 
 * @param {promisifiedObserverCallback} cb 
 * @param {boolean} buffered 
 */
export default function promisifyObserver(PerformanceObserver, entryType, cb, buffered) {
    return new Promise((resolve, reject) => {
        const observer = observe(PerformanceObserver, entryType, entries => cb(entries, result => {
            disconnectHandler(observer)();
            resolve(result);
        }), buffered);
        if (!observer) {
            reject(entryType);
        }
    });
}