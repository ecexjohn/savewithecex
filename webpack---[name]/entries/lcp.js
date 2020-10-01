import config from '../utils/config.js';
import {
    rejector,
    round,
    max,
    closestId
} from '../utils/utils.js';
import promisifyObserver from '../utils/promisifyObserver.js';

const entryType = 'largest-contentful-paint';

/**
 * Get LCP attributes
 * @param {import('../utils/utils.js').State}
 * @param {Promise<{fcp: number}>} paints 
 * @param {Promise<{tti: number}>} interactive 
 */
export default function lcp([, performance, PerformanceObserver, setTimeout, clearTimeout], paints, interactive) {
    return Promise.all([paints, interactive])
        .then(([{
            fcp
        }, {
            tti
        }]) => {
            const {
                lcpMin,
                downloadToRenderDelta,
                resourceDebounce
            } = config;
            const limit = max(tti, fcp + lcpMin);
            let timer = 0;

            return promisifyObserver(PerformanceObserver, entryType, (entries, resolve) => {
                const lcpCandidate = entries.reverse().find(({
                    url,
                    startTime
                }) => {
                    if (startTime < limit) {
                        return true;
                    }
                    if (url) {
                        const resource = performance.getEntriesByName(url)[0];
                        if (resource) {
                            const {
                                initiatorType,
                                startTime: st,
                                duration
                            } = resource;
                            if (st < limit && startTime - (st + duration) < downloadToRenderDelta && initiatorType !== 'link') {
                                return true;
                            }
                        }
                    }
                    return false;
                });

                if (lcpCandidate) {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        const {
                            startTime,
                            size,
                            id,
                            element
                        } = lcpCandidate;
                        const result = {
                            lcp: round(startTime),
                            lcpSize: size
                        };
                        const cid = closestId(element, id);
                        if (cid) {
                            result.closestId = cid;
                        }
                        resolve(result);
                    }, resourceDebounce);
                }
            });
        })
        .catch(rejector(entryType));
}