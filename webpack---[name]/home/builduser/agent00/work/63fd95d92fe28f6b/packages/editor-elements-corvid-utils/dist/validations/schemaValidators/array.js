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

function isTupleSchema(schema) {
    return Array.isArray(schema);
}
export function validateArray(value, schema, validateSchema, reportError, messageParams, suppressIndexError) {
    if (suppressIndexError === void 0) {
        suppressIndexError = false;
    }
    if (!assert.isArray(value)) {
        reportError(messages.invalidTypeMessage(__assign({
            value: value,
            types: schema.type
        }, messageParams)));
        return false;
    }
    var isValid = true;
    if (schema.items) {
        var itemsToValidateCount = isTupleSchema(schema.items) ?
            Math.min(value.length, schema.items.length) :
            value.length;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var itemIndex = 0; itemIndex < itemsToValidateCount; itemIndex++) {
            var item = value[itemIndex];
            var itemSchema = void 0;
            var propName = void 0;
            if (isTupleSchema(schema.items)) {
                itemSchema = schema.items[itemIndex];
                propName = schema.items[itemIndex].name;
            } else {
                itemSchema = schema.items;
                propName = schema.name;
            }
            var isItemValid = validateSchema(item, itemSchema, {
                functionName: messageParams.functionName,
                propertyName: propName || messageParams.propertyName,
                index: !suppressIndexError ? itemIndex : undefined,
            });
            if (!isItemValid) {
                isValid = false;
            }
        }
    }
    return isValid;
}
//# sourceMappingURL=array.js.map