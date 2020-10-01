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
export function validateInteger(value, schema, reportError, messageParams) {
    var minimum = schema.minimum,
        maximum = schema.maximum,
        enumArray = schema.enum;
    if (!assert.isInteger(value)) {
        reportError(messages.invalidTypeMessage(__assign({
            value: value,
            types: schema.type
        }, messageParams)));
        return false;
    }
    if (enumArray && !assert.isIn(value, enumArray)) {
        reportError(messages.invalidEnumValueMessage(__assign({
            value: value,
            enum: enumArray
        }, messageParams)));
        return false;
    }
    if ((assert.isNumber(minimum) && assert.isBelow(value, minimum)) ||
        (assert.isNumber(maximum) && assert.isAbove(value, maximum))) {
        reportError(messages.invalidNumberBoundsMessage(__assign({
            value: value,
            minimum: minimum, // minimum / maximum has to be of number type
            maximum: maximum
        }, messageParams)));
        return false;
    }
    return true;
}
//# sourceMappingURL=integer.js.map