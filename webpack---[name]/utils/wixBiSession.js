/**
 * Get wixBiSession for Wix sessions
 * @param {Window} window
 * @return {{renderType: string, } | undefined}
 */
export default function getWixBiSession(window) {
    return window.wixBiSession || window.bi ? .wixBiSession;
}