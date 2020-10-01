import {
    round,
    min,
    isBoolean,
    isNumber
} from '../utils/utils.js';

/**
 * Get client attributes
 * @param {import('../utils/utils.js').State}
 * @returns {Promise}
 */
export default function client([window]) {
    const {
        screen,
        navigator
    } = window;
    const result = {
        screenRes: `${screen.width}x${screen.height}`,
        availScreenRes: `${screen.availWidth}x${screen.availHeight}`,
        windowInner: `${window.innerWidth}x${window.innerHeight}`,
        windowOuter: `${window.outerWidth}x${window.outerHeight}`,
        devicePixelRatio: round(window.devicePixelRatio * 10),
        colorDepth: screen.colorDepth
    };
    const {
        orientation
    } = screen;
    if (orientation && orientation.type) {
        result.orientation = orientation.type;
    }
    const {
        connection,
        deviceMemory,
        hardwareConcurrency
    } = navigator;
    if (hardwareConcurrency) {
        result.cores = hardwareConcurrency;
    }
    if (deviceMemory) {
        result.memory = Math.floor(deviceMemory);
    }
    if (connection) {
        const {
            type,
            effectiveType,
            rtt,
            downlink,
            saveData
        } = connection;
        if (type) {
            result.networkType = type;
        }
        if (effectiveType) {
            result.effectiveType = effectiveType;
        }
        if (isNumber(rtt) && rtt) {
            result.rtt = rtt;
        }
        if (downlink) {
            result.download = min(round(downlink), 10000);
        }
        if (isBoolean(saveData)) {
            result.saveData = saveData;
        }
    }
    if (window.matchMedia) {
        const mql = window.matchMedia('(prefers-reduced-motion:reduce)');
        result.reducedMotion = mql.matches;
    }

    return !navigator.getBattery ?
        Promise.resolve(result) :
        navigator.getBattery()
        .then(({
            charging,
            level
        }) => {
            result.lowBattery = charging === false && level < 0.1;
            return result;
        })
        .catch(() => result);
}