import interaction from '../utils/interaction.js';
import tti_tbt from './tti-tbt.js';
import {
    addEventListener,
    fireEvent
} from '../utils/windowEvents.js';
import config from '../utils/config.js';
import {
    applyConsent,
    fixURL
} from '../utils/consent.js';

const subEntryType = 'page-transition';
const entryType = `${subEntryType}s`;

/**
 * Get page transition duration
 * @param {import('../utils/utils.js').State} state
 */
export default function pages(state) {
    const window = state[0];
    let origin = getCurrentURL();
    let pn = 1;

    /**
     * @type {Promise<{origin: string, destination: string}>[]}
     */
    const promises = [];
    const values = [];

    let resolve;
    const next = () => promises.push(new Promise(r => resolve = r));
    next();

    addEventListener(window, 'popstate', ({
        type,
        timeStamp
    }) => report(type, timeStamp, 0), false);
    interaction(state, report);

    return Promise.resolve({
        entryType,
        [Symbol.iterator]() {
            let index = 0;
            return {
                next: () => ({
                    value: values[index++],
                    done: index > values.length
                })
            };
        },
        [Symbol.asyncIterator]() {
            let index = 0;
            return {
                next: () => promises[index++]
            };
        }
    });

    function report(action, startTime, delay) {
        tti_tbt(state, Promise.resolve(startTime + delay)).then(finish => {
            const {
                round
            } = Math;
            const destination = getCurrentURL();
            if (destination !== origin) {
                const {
                    clientType,
                    pageEvent
                } = config;
                const duration = round(finish.tti - startTime);
                const value = Object.freeze(applyConsent(state[0], {
                    entryType: subEntryType,
                    clientType,
                    origin,
                    destination,
                    action,
                    startTime: round(startTime),
                    delay: round(delay),
                    duration,
                    pn: pn++,
                    ...finish
                }));
                origin = destination;
                values.push(value);
                resolve({
                    value
                });
                next();
                fireEvent(window, pageEvent, value);
            }
        });
    }

    function getCurrentURL() {
        return fixURL(window.location.href, window);
    }
}