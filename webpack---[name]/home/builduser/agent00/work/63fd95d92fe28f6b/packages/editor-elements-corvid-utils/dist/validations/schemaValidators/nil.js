var __assign = (this && this.__assign) || function() {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import {
    assert
} from '../../assert';
import {
    messages
} from '../../messages';
export function validateNil(value, schema, reportError, reporterParams) {
    if (!assert.isNil(value)) {
        reportError(messages.invalidTypeMessage(__assign({
            value: value,
            types: schema.type
        }, reporterParams)));
        return false;
    }
    return true;
}
//# sourceMappingURL=nil.js.map