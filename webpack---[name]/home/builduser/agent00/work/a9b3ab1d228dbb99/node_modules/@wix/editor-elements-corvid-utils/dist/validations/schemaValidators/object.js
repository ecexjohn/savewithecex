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
var hasOwnProperty = Object.prototype.hasOwnProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
export function validateObject(value, schema, validateSchema, reportError, reportWarning, messageParams, compName) {
    if (schema.warnIfNil && assert.isNil(value)) {
        reportWarning(messages.nilAssignmentMessage(__assign(__assign({}, messageParams), {
            compName: compName
        })));
    }
    if (!assert.isObject(value)) {
        reportError(messages.invalidTypeMessage(__assign({
            types: schema.type,
            value: value
        }, messageParams)));
        return false;
    }
    if (schema.required) {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var propNameIdx = 0; propNameIdx < schema.required.length; propNameIdx++) {
            if (!hasOwnProperty.call(value, schema.required[propNameIdx])) {
                reportError(messages.missingFieldMessage({
                    functionName: messageParams.functionName,
                    index: messageParams.index,
                    propertyName: schema.required[propNameIdx],
                }));
                return false;
            }
        }
    }
    var isValid = true;
    if (schema.properties) {
        var propNames = getOwnPropertyNames(schema.properties);
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var propNameIdx = 0; propNameIdx < propNames.length; propNameIdx++) {
            var propName = propNames[propNameIdx];
            if (hasOwnProperty.call(value, propName)) {
                var propSchema = schema.properties[propName];
                var propValue = value[propName]; // hmmm...
                var isPropValid = validateSchema(propValue, propSchema, {
                    functionName: messageParams.functionName,
                    index: messageParams.index,
                    propertyName: propName,
                });
                if (!isPropValid) {
                    isValid = false;
                }
            }
        }
    }
    return isValid;
}
//# sourceMappingURL=object.js.map