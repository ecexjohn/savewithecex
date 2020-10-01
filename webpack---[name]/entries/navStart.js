import {
    getFirstEntryByType,
    isNumber
} from '../utils/utils.js';
import {
    fixURL
} from '../utils/consent.js';

const entryType = 'navigation';

/**
 * @param {import('../utils/utils.js').State}
 */
export default function navStart([window, performance]) {
    const {
        round
    } = Math;

    let result;

    let navigation = getFirstEntryByType(performance, entryType);
    if (navigation) {
        result = {
            navigationType: navigation.type,
            protocol: navigation.nextHopProtocol
        };
    } else {
        navigation = performance.timing;
        result = {};
    }

    const {
        navigationStart = 0, fetchStart, domainLookupStart, domainLookupEnd, redirectStart, redirectEnd, connectStart, connectEnd, secureConnectionStart, requestStart, responseStart
    } = navigation;
    if (isNumber(fetchStart)) {
        result.fetchStart = round(fetchStart - navigationStart);
    }

    result.dns = round(domainLookupEnd - domainLookupStart);
    const redirect = round(redirectEnd - redirectStart);
    if (redirect) {
        result.redirect = redirect;
    }

    if (secureConnectionStart) {
        result.tcp = round(secureConnectionStart - connectStart);
        result.ssl = round(connectEnd - secureConnectionStart);
    } else {
        result.tcp = round(connectEnd - connectStart);
    }

    result.ttfb = round(responseStart - navigationStart);
    result.response = round(responseStart - requestStart);

    const {
        document: {
            referrer
        },
        location: {
            href
        }
    } = window;
    result.url = fixURL(href, window);
    if (referrer) {
        result.referrer = fixURL(referrer, window);
    }

    return Promise.resolve(result);
}