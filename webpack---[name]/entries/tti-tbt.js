import config from '../utils/config.js';
import observeResources, {
    isScript,
    isAjax
} from '../utils/observeResources.js';
import {
    noop,
    max,
    min,
    rejector
} from '../utils/utils.js';
import {
    dcl
} from '../utils/windowEvents.js';
import longtasks from '../polyfills/longtasks.js';

const entryType = 'interactive';

/**
 * Get TTI and TBT attributes
 * @param {import('../utils/utils.js').State} state 
 * @param {Promise<number>} start
 * @param {Promise<{startTime: number, delay: number}>} [interaction]
 */
export default function tti_tbt(state, start, interaction) {
    const [window, , PerformanceObserver, setTimeout, clearTimeout] = state;
    const {
        resourceDebounce,
        taskDelta,
        ttiDurationInc
    } = config;

    return start
        .then(start => new Promise(resolve => {
            let finished = start;
            let stopResources = false;

            let taskTimer = 0;
            const lts = [];
            const stopLT = longtasks(state, entries => {
                lts.push(...entries);
                if (taskTimer) {
                    clearTimeout(taskTimer);
                    scheduleDone();
                }
            });

            const dclPromise = dcl(window);
            let resourceTimer = setTimeout(scheduleDone, resourceDebounce);
            const {
                finish
            } = observeResources(PerformanceObserver, rs => {
                if (stopResources) {
                    clearTimeout(resourceTimer);
                    return;
                }
                rs = rs.filter(r => isAjax(r) || isScript(r));
                if (rs.length) {
                    finished = rs.reduce((acc, {
                        startTime,
                        duration
                    }) => max(acc, startTime + duration), finished);
                    dclPromise.then(dclTime => {
                        finished = max(dclTime, finished);
                        clearTimeout(resourceTimer);
                        resourceTimer = setTimeout(scheduleDone, resourceDebounce);
                    });
                }
            }, false);

            interaction ? .then(({
                startTime,
                delay
            }) => doneTasks(startTime + delay), noop);

            function doneTasks(interactionEnd = 1000000) {
                stopLT();
                resolve([
                    lts,
                    start,
                    finished,
                    interactionEnd
                ]);
            }

            function scheduleDone() {
                finish();
                stopResources = true;
                taskTimer = setTimeout(doneTasks, taskDelta);
            }
        }))
        .then(([lts, start, finished, interactionEnd]) => {
            const {
                round
            } = Math;
            const tti = calc_tti(lts, start, finished, interactionEnd);
            const {
                document,
                innerHeight
            } = window;
            const tbt = calc_tbt(lts, tti);
            const result = {
                tti: round(tti),
                tbt: round(tbt),
                iframes: document.querySelectorAll('iframe').length
            };
            const pageHeight = max(document.body.offsetHeight, innerHeight);
            if (pageHeight > 0) {
                result.screens = round(document.body.scrollHeight / pageHeight);
            }
            return result;
        })
        .catch(rejector(entryType));

    function calc_tti(lts, start, finished, interactionEnd) {
        if (start === finished) {
            finished += ttiDurationInc;
        }
        let tail = lts.findIndex(({
            startTime,
            duration
        }) => {
            if (startTime > finished + taskDelta) {
                return true;
            }
            finished = max(finished, startTime + duration);
        });
        if (tail === -1) {
            tail = lts.length;
        }
        const found = tail > 0 ? (llt => llt.startTime + llt.duration)(lts[tail - 1]) : 0;
        return max(min(found, interactionEnd), start);
    }

    function calc_tbt(lts, tti) {
        let tbt = 0;
        for (let i = 0; i < lts.length; ++i) {
            const {
                startTime,
                duration
            } = lts[i];
            if (startTime > tti) {
                break;
            }
            tbt += duration - 50;
        }
        return tbt;
    }
}