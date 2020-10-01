import config from './config.js';
import observe from './observe.js';
import {
    handleFinish,
    disconnectHandler
} from './utils.js';

export const isScript = ({
    initiatorType,
    name
}) => initiatorType === 'script' || (initiatorType === 'link' && /\.js$/.test(name));
export const isAjax = ({
    initiatorType
}) => initiatorType === 'fetch' || initiatorType === 'xmlhttprequest';
export const isImage = ({
    initiatorType,
    name
}) => initiatorType === 'img' || initiatorType === 'image' || initiatorType === 'css' && /\.(?:jpe?g|png|webp|gif)/i.test(name);
export const isFont = ({
    initiatorType,
    name
}) => (initiatorType === 'css' && name.includes('font')) || /\.(?:woff2?|ttf|eot)/i.test(name);

/**
 * @callback observeResourcesCallback
 * @param {PerformanceEntryList} 
 * @returns {void}
 */

/**
 * @type {PerformanceObserver}
 */
let observer;
/**
 * @type {observeResourcesCallback[]}
 */
const cbs = [];

/**
 * 
 * @param {function} PerformanceObserver 
 * @param {observeResourcesCallback} cb 
 * @param {boolean} buffered
 */
export default function observeResources(PerformanceObserver, cb, buffered) {
    if (cbs.push(cb) === 1) {
        const ignores = config.ignoreResources.split(',');
        observer = observe(PerformanceObserver, 'resource', entries => {
            entries = entries.filter(({
                name
            }) => !ignores.some(ignore => name.includes(ignore)));
            if (entries.length) {
                cbs.forEach(cb => cb(entries));
            }
        }, buffered);
    }
    return {
        observer,
        finish: handleFinish(cbs, cb, disconnectHandler(observer))
    };
}