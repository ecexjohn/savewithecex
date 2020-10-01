import {
    round
} from '../utils/utils.js';
import {
    addEventListener
} from '../utils/windowEvents.js';

/**
 * Get visibility attributes
 * @param {import('../utils/utils.js').State}
 */
export default function hidden([window]) {
    const VISIBILITY = 'visibilitychange';
    const UNLOAD = 'unload';

    return new Promise(resolve => {
        if (document.hidden) {
            return done(VISIBILITY, 0);
        }

        addEventListener(window.document, VISIBILITY, genHandler(VISIBILITY));
        addEventListener(window, UNLOAD, genHandler(UNLOAD));

        function genHandler(type) {
            return ({
                timeStamp
            }) => done(type, timeStamp);
        }

        function done(type, timeStamp) {
            resolve({
                entryType: 'visibility',
                type,
                startTime: round(timeStamp)
            });
        }
    });
}