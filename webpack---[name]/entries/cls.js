import observe from '../utils/observe.js';
import {
    CLS_FACTOR
} from '../utils/constants.js';
import {
    rejector,
    round,
    max,
    disconnectHandler
} from '../utils/utils.js';

const entryType = 'layout-shift';

/**
 * Get CLS attributes
 * @param {import('../utils/utils.js').State}
 * @param {Promise<{tti: number}>} interactive 
 * @param {Promise<{lcp: number}>} lastPaint 
 */
export default function cls([, , PerformanceObserver], interactive, lastPaint) {
    return Promise.all([interactive, lastPaint])
        .then(([{
            tti
        }, {
            lcp
        }]) => {
            const finish = max(tti, lcp);
            const observer = observe(PerformanceObserver, entryType);
            if (!observer) {
                throw entryType;
            }
            const entries = observer.takeRecords ? .();
            disconnectHandler(observer)();
            if (!entries) {
                throw entryType;
            }
            let cls = 0;
            let countCls = 0;
            for (const {
                    lastInputTime,
                    startTime,
                    value
                } of entries) {
                if (lastInputTime > 0 || startTime > finish) {
                    break;
                }
                cls += value;
                ++countCls;
            }
            return {
                cls: round(cls * CLS_FACTOR),
                countCls
            };
        })
        .catch(rejector(entryType));
}