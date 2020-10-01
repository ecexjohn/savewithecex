const ESSENTIAL_FIELDS = {
    entryType: true,
    clientType: true,
    dns: true,
    tcp: true,
    ssl: true,
    ttfb: true,
    _brandId: true,
    viewerName: true,
    v: true,
    dc: true,
    microPop: true,
    cdn: true,
    msid: true,
    pageId: true,
    fp: true,
    fcp: true,
    tti: true,
    tbt: true,
    lcp: true,
    cls: true,
    ttlb: true,
    dcl: true,
    isSsr: true,
    ssrCaching: true,
    ssrDuration: true,
    startTime: true,
    duration: true,
    delay: true,
    action: true,
    type: true,
    pn: true,
    simLH6: true,
    isMobile: true
};

/**
 * Apply consent policy restrictions
 * @param {Window}
 * @param {Object} measurement 
 */
export function applyConsent({
    consentPolicyManager
}, measurement) {
    if (Symbol.iterator in measurement) {
        return measurement;
    }

    const analytics = analyticsAllowed(consentPolicyManager);
    if (analytics) {
        return measurement;
    }

    return Object.entries(measurement)
        .filter(isEssentialField)
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
}

function isEssentialField([key]) {
    return ESSENTIAL_FIELDS[key];
}

/**
 * Shorten URL to imporant part
 * @param {string} url 
 * @param {Window}
 */
export function fixURL(url, {
    consentPolicyManager
}) {
    const e = /^https?:\/\/(?:www\.)?(.*)/.exec(url);
    if (e) {
        const short = e[1];
        return analyticsAllowed(consentPolicyManager) || !short ? short : short.replace(/\?.*$/, '');
    }
}

/**
 * @param {{getCurrentConsentPolicy: () => {policy: {analytics: boolean}}}} [consentPolicyManager]
 */
function analyticsAllowed(consentPolicyManager) {
    return consentPolicyManager ? .getCurrentConsentPolicy() ? .policy ? .analytics !== false;
}