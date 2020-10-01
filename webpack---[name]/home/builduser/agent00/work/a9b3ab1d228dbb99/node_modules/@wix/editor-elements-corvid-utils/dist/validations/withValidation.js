import {
    reportError,
    reportWarning
} from '../reporters';
import {
    createSchemaValidator
} from './createSchemaValidator';
export function createCompSchemaValidator(compName, _a) {
    var _b = (_a === void 0 ? {} : _a).suppressIndexErrors,
        suppressIndexErrors = _b === void 0 ? false : _b;
    return createSchemaValidator({
        reportError: reportError,
        reportWarning: reportWarning
    }, compName, {
        suppressIndexErrors: suppressIndexErrors,
    });
}
export function withValidation(sdkFactory, schema, rules) {
    if (rules === void 0) {
        rules = {};
    }
    return function(api) {
        var sdk = sdkFactory(api);
        var schemaValidator = createCompSchemaValidator(api.metaData.role);
        var argsSchemaValidator = createCompSchemaValidator(api.metaData.role, {
            suppressIndexErrors: true,
        });
        var sdkWithValidation = Object.keys(sdk).reduce(function(acc, sdkPropName) {
            var propDesc = Object.getOwnPropertyDescriptor(sdk, sdkPropName);
            var propWithValidationDesc = {
                // retrieve value from sdk
                enumerable: true,
                configurable: true,
            };
            // data descriptor (functions, variables)
            if (propDesc.value) {
                if (typeof propDesc.value === 'function') {
                    propWithValidationDesc.value = function() {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        var argsSchema = schema.properties[sdkPropName] &&
                            schema.properties[sdkPropName].args;
                        var customValidation = rules[sdkPropName];
                        var isValid = true;
                        if (argsSchema) {
                            isValid = argsSchemaValidator(args, {
                                type: ['array'],
                                items: argsSchema
                            }, sdkPropName);
                        }
                        if (isValid && customValidation) {
                            isValid = customValidation.every(function(p) {
                                return p(args, api);
                            });
                        }
                        return isValid ? propDesc.value.apply(propDesc, args) : undefined;
                    };
                } else {
                    // delegate assignment to sdk
                    propWithValidationDesc.value = propDesc.value;
                }
            }
            // accessor descriptor
            else {
                if (propDesc.get) {
                    propWithValidationDesc.get = function() {
                        return sdk[sdkPropName];
                    };
                }
                if (propDesc.set) {
                    propWithValidationDesc.set = function(value) {
                        var customValidation = rules[sdkPropName];
                        var isValid = true;
                        if (schema.properties[sdkPropName]) {
                            isValid = schemaValidator(value, schema.properties[sdkPropName], sdkPropName);
                        }
                        if (isValid && customValidation) {
                            isValid = customValidation.every(function(p) {
                                return p(value, api);
                            });
                        }
                        if (!isValid) {
                            return;
                        }
                        // delegate assignment to sdk
                        sdk[sdkPropName] = value;
                    };
                }
            }
            Object.defineProperty(acc, sdkPropName, propWithValidationDesc);
            return acc;
        }, {});
        return sdkWithValidation;
    };
}
//# sourceMappingURL=withValidation.js.map