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
} from '../assert';
import {
    messages
} from '../messages';
import * as typeValidators from './schemaValidators';
export function createSchemaValidator(_a, compName, _b) {
    var origReportError = _a.reportError,
        reportWarning = _a.reportWarning;
    var _c = (_b === void 0 ? {} : _b).suppressIndexErrors,
        suppressIndexErrors = _c === void 0 ? false : _c;

    function validate(value, schema, setterName) {
        return validateSchema(value, schema, {
            functionName: setterName,
            propertyName: setterName,
            /**
             * This intentional? In such a case all errors related to "index"
             * will never be fired
             */
            index: undefined,
        });
    }

    function validateSchema(value, schema, params) {
        var isValid = false;
        var errorMessageQueue = new Set();
        var reportError = function(message) {
            errorMessageQueue.add(message);
        };
        if (schema.warnIfNil && assert.isNil(value)) {
            reportWarning(messages.nilAssignmentMessage(__assign(__assign({}, params), {
                compName: compName
            })));
        }
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var typeIdx = 0; typeIdx < schema.type.length; typeIdx++) {
            var validateSchemaForType = validatorsMap[schema.type[typeIdx]];
            if (validateSchemaForType(value, schema, params, reportError)) {
                isValid = true;
                break;
            }
        }
        if (!isValid && errorMessageQueue.size) {
            errorMessageQueue.forEach(function(message) {
                return origReportError(message);
            });
        }
        return isValid;
    }
    var validatorsMap = {
        object: function(value, schema, messageParams, reportError) {
            return typeValidators.validateObject(value, schema, validateSchema, reportError, reportWarning, messageParams, compName);
        },
        array: function(value, schema, messageParams, reportError) {
            return typeValidators.validateArray(value, schema, validateSchema, reportError, messageParams, suppressIndexErrors);
        },
        number: function(value, schema, messageParams, reportError) {
            return typeValidators.validateNumber(value, schema, reportError, messageParams);
        },
        integer: function(value, schema, messageParams, reportError) {
            return typeValidators.validateInteger(value, schema, reportError, messageParams);
        },
        string: function(value, schema, messageParams, reportError) {
            return typeValidators.validateString(value, schema, reportError, messageParams);
        },
        boolean: function(value, schema, messageParams, reportError) {
            return typeValidators.validateBoolean(value, schema, reportError, messageParams);
        },
        date: function(value, schema, messageParams, reportError) {
            return typeValidators.validateDate(value, schema, reportError, messageParams);
        },
        nil: function(value, schema, messageParams, reportError) {
            return typeValidators.validateNil(value, schema, reportError, messageParams);
        },
        function: function(value, schema, messageParams, reportError) {
            return typeValidators.validateFunction(value, schema, reportError, messageParams);
        },
    };
    return validate;
}
//# sourceMappingURL=createSchemaValidator.js.map