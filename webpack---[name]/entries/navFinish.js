import {
    load
} from '../utils/windowEvents.js';
import {
    isNumber,
    getFirstEntryByType
} from '../utils/utils.js';

const entryType = 'navigation';

const CACHE_LIMIT_MS = 13;
const CDN_LIMIT_MS = 333;

const BROWSER = 'browser';
const ETAG = 'eTag';
const MAYBE = 'maybe';

/**
 * 
 * @param {import('../utils/utils.js').State}
 */
export default function navFinish([, performance]) {
    return load(window).then(() => {
        const {
            round
        } = Math;

        let result;

        let navigationStart;
        let navigation = getFirstEntryByType(performance, entryType);
        if (navigation) {
            const {
                duration,
                transferSize,
                decodedBodySize
            } = navigation;
            navigationStart = 0;
            result = {
                duration: round(duration),
                transferSize,
                decodedBodySize
            };
        } else {
            navigation = performance.timing;
            ({
                navigationStart
            } = navigation);
            result = {
                duration: navigation.loadEventStart - navigationStart
            };
        }

        const {
            responseEnd,
            domContentLoadedEventEnd
        } = navigation;
        result.ttlb = round(responseEnd - navigationStart);
        result.dcl = round(domContentLoadedEventEnd - navigationStart);

        result.entryType = `${entryType}-finish`;
        const caching = determineCaching(navigation);
        if (caching) {
            result.caching = caching;
        }

        return result;
    });
}

function determineCaching({
    requestStart,
    responseStart,
    responseEnd,
    transferSize,
    encodedBodySize
}) {
    if (isNumber(transferSize)) {
        if (transferSize === 0) {
            return BROWSER;
        }
        if (transferSize < encodedBodySize) {
            return ETAG;
        }
    } else {
        if (responseStart - requestStart < CACHE_LIMIT_MS) {
            return BROWSER;
        }
        if (responseEnd - responseStart < CACHE_LIMIT_MS) {
            return `${MAYBE} ${ETAG}`;
        }
    }
    if (responseEnd - responseStart < CDN_LIMIT_MS) {
        return `${MAYBE} CDN`;
    }
}