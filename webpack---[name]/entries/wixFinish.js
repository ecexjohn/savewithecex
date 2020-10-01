import {
    addField,
    allFulfilled
} from '../utils/utils.js';
import {
    dcl
} from '../utils/windowEvents.js';
import getWixBiSession from '../utils/wixBiSession.js';

const entryType = 'wix-finish';

const FIELDS = [
    'cdn',
    'microPop',
    'caching',
    'is_rollout',
    'is_platform_loaded',
    'maybeBot'
];
const MAP_NAME = {
    caching: 'ssrCaching',
    is_rollout: 'isRollout',
    is_platform_loaded: 'isPlatformLoaded'
};

/**
 * Final Wix session attributes
 * @param {import('../utils/utils.js').State}
 * @param {Promise} interactive
 */
export default function wixFinish([window], interactive) {
    return allFulfilled([interactive, dcl(window)]).then(() => {
        const wixBiSession = getWixBiSession(window);
        if (!wixBiSession) {
            throw entryType;
        }

        const isSsr = !window.clientSideRender;
        const result = {
            entryType,
            isSsr
        };

        addField(result, 'pageId', window.rendererModel ? .landingPageId || window.firstPageId);
        if (isSsr) {
            addField(result, 'ssrDuration', window.ssrInfo ? .timeSpentInSSR);
        }

        FIELDS.forEach(field => addField(result, MAP_NAME[field] || field, wixBiSession[field]));

        return result;
    });
}