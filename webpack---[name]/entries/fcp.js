import promisifyObserver from '../utils/promisifyObserver.js';
import {
    round
} from '../utils/utils.js';
import fcpPolyfill from '../polyfills/fcp.js';

const entryType = 'paint';

const FCP = 'fcp';

const MAP_NAME = {
    'first-paint': 'fp',
    'first-contentful-paint': FCP
};

/**
 * Get FCP
 * @param {import('../utils/utils.js').State}
 */
export default function fcp([window, , PerformanceObserver]) {
    const paints = {
        entryType: `initial-${entryType}`
    };
    return promisifyObserver(PerformanceObserver, entryType, (entries, resolve) => {
        let done = false;
        entries.forEach(({
            name,
            startTime
        }) => {
            name = MAP_NAME[name] || name;
            paints[name] = round(startTime);
            if (name === FCP) {
                done = true;
            }
        });
        if (done) {
            resolve(paints);
        }
    }).catch(() => fcpPolyfill(window, paints.entryType));
}