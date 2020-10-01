import promisifyObserver from '../utils/promisifyObserver.js';
import {
    closestId
} from '../utils/utils.js';
import fidPolyfill from '../polyfills/fid.js';

const entryType = 'first-input';

/**
 * Resolve FID attribues
 * @param {import('../utils/utils.js').State} state
 */
export default function fid(state) {
    const [, , PerformanceObserver] = state;
    const {
        round
    } = Math;
    return promisifyObserver(PerformanceObserver, entryType, (entries, resolve) => {
        const {
            name,
            startTime,
            processingStart,
            duration,
            target
        } = entries[0];
        const result = {
            entryType,
            action: name,
            startTime: round(startTime),
            delay: round(processingStart - startTime),
            duration: round(duration)
        };
        const cid = closestId(target);
        if (cid) {
            result.closestId = cid;
        }
        resolve(result);
    }).catch(() => fidPolyfill(state, entryType));
}