import observe from '../utils/observe.js';
import config from '../utils/config.js';
import {
    disconnectHandler
} from '../utils/utils.js';

/**
 * Resolve longtask polyfill attribues
 * @param {import('../utils/utils.js').State}
 * @param {import('../utils/observe.js').observerCallback} cb
 */
export default function longtasks([{
    requestAnimationFrame,
    cancelAnimationFrame
}, performance, PerformanceObserver], cb) {
    const observer = observe(PerformanceObserver, 'longtask', cb, false); // false because buffered not fully supported yet for longtask
    if (observer) {
        return disconnectHandler(observer);
    }

    // Use polyfill
    let startTime = performance.now();
    const {
        longTask
    } = config;
    let id = requestAnimationFrame(getTaskDuration);
    return () => cancelAnimationFrame(id);

    function getTaskDuration(now) {
        const duration = now - startTime;
        if (duration >= longTask) {
            cb([{
                startTime,
                duration
            }]);
        }
        startTime = now;
        id = requestAnimationFrame(getTaskDuration);
    }
}