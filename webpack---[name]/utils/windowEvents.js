import {
    LISTEN,
    LISTEN_ONCE
} from './constants.js';

/**
 * Hook up DOM event handler
 * @param {Element} target 
 * @param {string} type 
 * @param {EventListenerOrEventListenerObject} listener 
 * @param {boolean} [once = true] 
 */
export function addEventListener(target, type, listener, once = true) {
    target.addEventListener(type, listener, once ? LISTEN_ONCE : LISTEN);
}
/**
 * Remove DOM event handler
 * @param {Element} target 
 * @param {string} type 
 * @param {EventListenerOrEventListenerObject} listener 
 * @param {boolean} [once = true] 
 */
export function removeEventListener(target, type, listener, once = true) {
    target.removeEventListener(type, listener, once ? LISTEN_ONCE : LISTEN);
}

export const dcl = once(readyState => readyState !== 'loading', 'DOMContentLoaded');
export const load = once(readyState => readyState === 'complete', 'load');

function stateToPromise(window, isState, eventName) {
    return new Promise(resolve => {
        if (isState(window.document.readyState)) {
            resolve(0);
        } else {
            addEventListener(window, eventName, ({
                timeStamp
            }) => resolve(timeStamp));
        }
    });
}
/**
 * @param {(s:string) => (boolean)} isState 
 * @param {string} eventName 
 * @returns {(w:Window) => Promise<number>}
 */
function once(isState, eventName) {
    let promise;
    return function(window) {
        if (!promise) {
            promise = stateToPromise(window, isState, eventName);
        }
        return promise;
    };
}

/**
 * Dispatch a custom event
 * @param {Window} window 
 * @param {string} label 
 * @param {any} detail 
 * @param {EventTarget} [target=window] 
 */
export function fireEvent(window, label, detail, target = window) {
    target.dispatchEvent(new window.CustomEvent(label, {
        detail
    }));
}