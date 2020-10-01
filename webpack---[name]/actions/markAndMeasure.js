import {
    noop,
    label,
    allFulfilled
} from '../utils/utils.js';

const TTI_LABEL = label('tti');
const LCP_LABEL = label('lcp');

/**
 * Create marks and measures for performance metrics
 * @param {Performance} performance 
 * @param {Promise<{entryType: string}>[]} measurements 
 */
export default function markAndMeasure(performance, measurements) {
    allFulfilled(measurements)
        .then(values => {
            const {
                tti,
                tbt,
                lcp
            } = find(values, 'loaded');
            if (!mark(TTI_LABEL, tti, tbt)) {
                performance.clearMarks(TTI_LABEL); // Don't show wrong mark/measure on limited browsers
                return;
            }
            mark(LCP_LABEL, lcp);

            const {
                fcp
            } = find(values, 'initial-paint');
            const lcpDuration = {
                end: lcp
            };
            const ttiDuration = {
                end: tti,
                detail: tbt
            };
            [lcpDuration.start, ttiDuration.start] = lcp < tti ? [fcp, lcp] : [tti, fcp];
            measure(LCP_LABEL, lcpDuration);
            measure(TTI_LABEL, ttiDuration);
        }, noop);

    /**
     * 
     * @param {{entryType: string}[]} values 
     * @param {string} et 
     * @returns {{fcp: number, tti: number, tbt: number, lcp: number}}
     */
    function find(values, et) {
        return values.find(({
            entryType
        }) => entryType === et) || {};
    }

    function mark(label, startTime, detail) {
        if (startTime) {
            return performance.mark(label, {
                startTime,
                detail
            });
        }
    }

    function measure(label, options) {
        if (options.end > options.start) {
            performance.measure(label, options);
        }
    }
}