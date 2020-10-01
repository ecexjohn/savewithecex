import {
    isUndefined,
    isBoolean,
    isNumber
} from './utils.js';
import getWixBiSession from './wixBiSession.js';

const config = {
    __proto__: {
        load
    },

    resourceDebounce: 3000,
    taskDelta: 300,
    lcpMin: 500,
    downloadToRenderDelta: 1000,
    longTask: 60,
    eventDelta: 500,
    ttiDurationInc: 2000,

    ignoreResources: 'cdn_detect,-analytics,perf-measure',

    label: 'wixPerformanceMeasurements',
    clientType: '',
    fcpPolyfill: 'wixFirstPaint',
    fcpPolyfillId: 'wix-first-paint',
    pageEvent: 'wixPageMeasurements',

    noMeasure: false,
    log: false
};

/**
 * Load configuration from script tag dataSet
 * @param {Window} window
 * @param {DOMStringMap} dataset 
 */
function load(window, dataset) {
    Object.entries(config)
        .map(([key, value]) => [dataset[key], key, value])
        .filter(([data]) => !isUndefined(data))
        .forEach(([data, key, value]) => {
            if (isBoolean(value)) {
                data = true;
            } else if (isNumber(value)) {
                const n = Number(data);
                data = Number.isNaN(n) ? value : n;
            }
            config[key] = data;
        });

    if (!config.clientType && getWixBiSession(window)) {
        config.clientType = 'ugc';
    }
}

export default config;