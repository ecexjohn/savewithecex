import {
    assert
} from '../assert';
import {
    templates
} from './messageTemplates';
export var nilAssignmentMessage = function(_a) {
    var compName = _a.compName,
        functionName = _a.functionName,
        propertyName = _a.propertyName,
        index = _a.index;
    if (assert.isNumber(index)) {
        return templates.warning_not_null_with_index({
            propertyName: propertyName,
            functionName: functionName,
            index: index,
        });
    }
    if (compName) {
        return templates.warning_not_null_for_comp_name({
            compName: compName,
            functionName: functionName,
            propertyName: propertyName,
        });
    }
    return templates.warning_not_null({
        functionName: functionName,
        propertyName: propertyName
    });
};
export var missingFieldMessage = function(_a) {
    var functionName = _a.functionName,
        propertyName = _a.propertyName,
        index = _a.index;
    return assert.isNumber(index) ?
        templates.error_mandatory_val_with_index({
            functionName: functionName,
            propertyName: propertyName,
            index: index,
        }) :
        templates.error_mandatory_val({
            functionName: functionName,
            propertyName: propertyName
        });
};
export var invalidStringLengthMessage = function(_a) {
    var functionName = _a.functionName,
        propertyName = _a.propertyName,
        value = _a.value,
        maximum = _a.maximum,
        minimum = _a.minimum,
        index = _a.index;
    if (minimum && maximum) {
        if (minimum === maximum) {
            return assert.isNumber(index) ?
                templates.error_length_accept_single_value_with_index({
                    functionName: functionName,
                    propertyName: propertyName,
                    value: value,
                    expectedValue: minimum,
                    index: index,
                }) :
                templates.error_length_accept_single_value({
                    functionName: functionName,
                    propertyName: propertyName,
                    value: value,
                    expectedValue: minimum,
                });
        }
        return assert.isNumber(index) ?
            templates.error_length_in_range_with_index({
                functionName: functionName,
                propertyName: propertyName,
                value: value,
                maximum: maximum,
                minimum: minimum,
                index: index,
            }) :
            templates.error_length_in_range({
                functionName: functionName,
                propertyName: propertyName,
                value: value,
                maximum: maximum,
                minimum: minimum,
            });
    }
    if (!minimum && maximum) {
        return assert.isNumber(index) ?
            templates.error_length_exceeds_with_index({
                functionName: functionName,
                propertyName: propertyName,
                value: value,
                maximum: maximum,
                index: index,
            }) :
            templates.error_length_exceeds({
                functionName: functionName,
                propertyName: propertyName,
                value: value,
                maximum: maximum,
            });
    }
    // valided minimum length
    return assert.isNumber(index) ?
        templates.error_length_less_than_with_index({
            functionName: functionName,
            propertyName: propertyName,
            value: value,
            minimum: minimum,
            index: index,
        }) :
        templates.error_length_less_than({
            functionName: functionName,
            propertyName: propertyName,
            value: value,
            minimum: minimum,
        });
};
export var invalidNumberBoundsMessage = function(_a) {
    var functionName = _a.functionName,
        propertyName = _a.propertyName,
        value = _a.value,
        minimum = _a.minimum,
        maximum = _a.maximum,
        index = _a.index;
    if (minimum && maximum) {
        if (minimum === maximum) {
            return assert.isNumber(index) ?
                templates.error_accept_single_value_with_index({
                    functionName: functionName,
                    propertyName: propertyName,
                    expectedValue: minimum,
                    value: value,
                    index: index,
                }) :
                templates.error_accept_single_value({
                    functionName: functionName,
                    propertyName: propertyName,
                    expectedValue: minimum,
                    value: value,
                });
        }
        return assert.isNumber(index) ?
            templates.error_range_with_index({
                functionName: functionName,
                propertyName: propertyName,
                value: value,
                maximum: maximum,
                minimum: minimum,
                index: index,
            }) :
            templates.error_range({
                functionName: functionName,
                propertyName: propertyName,
                value: value,
                maximum: maximum,
                minimum: minimum,
            });
    }
    if (!minimum && maximum) {
        return assert.isNumber(index) ?
            templates.error_less_than_with_index({
                functionName: functionName,
                propertyName: propertyName,
                maximum: maximum,
                value: value,
                index: index,
            }) :
            templates.error_less_than({
                functionName: functionName,
                propertyName: propertyName,
                maximum: maximum,
                value: value,
            });
    }
    return assert.isNumber(index) ?
        templates.error_larger_than_with_index({
            functionName: functionName,
            propertyName: propertyName,
            value: value,
            minimum: minimum,
            index: index,
        }) :
        templates.error_larger_than({
            functionName: functionName,
            propertyName: propertyName,
            value: value,
            // TS should know that minimum can't be undefined here
            minimum: minimum,
        });
};
export var invalidTypeMessage = function(_a) {
    var functionName = _a.functionName,
        propertyName = _a.propertyName,
        types = _a.types,
        value = _a.value,
        index = _a.index;
    var expectedType = types
        .map(function(type) {
            return (type === 'nil' ? 'null' : type);
        })
        .join(',');
    return assert.isNumber(index) ?
        templates.error_type_with_index({
            functionName: functionName,
            index: index,
            propertyName: propertyName,
            value: value,
            expectedType: expectedType,
        }) :
        templates.error_type({
            functionName: functionName,
            propertyName: propertyName,
            value: value,
            expectedType: expectedType,
        });
};
export var invalidEnumValueMessage = function(_a) {
    var functionName = _a.functionName,
        propertyName = _a.propertyName,
        value = _a.value,
        enumArray = _a.enum,
        index = _a.index;
    var expectedType = "from (" + enumArray.join(',') + ")";
    return assert.isNumber(index) ?
        templates.error_type_with_index({
            functionName: functionName,
            propertyName: propertyName,
            value: value,
            expectedType: expectedType,
            index: index,
        }) :
        templates.error_type({
            functionName: functionName,
            propertyName: propertyName,
            value: value,
            expectedType: expectedType,
        });
};
export var patternMismatchMessage = function(_a) {
    var functionName = _a.functionName,
        propertyName = _a.propertyName,
        value = _a.value,
        index = _a.index;
    return assert.isNumber(index) ?
        templates.error_bad_format_with_index({
            functionName: functionName,
            propertyName: propertyName,
            value: value,
            index: index,
        }) :
        templates.error_bad_format({
            functionName: functionName,
            propertyName: propertyName,
            value: value
        });
};
export var noneImageInGallery = function(galleryId) {
    return templates.warning_non_images_in_gallery({
        galleryId: galleryId,
    });
};
export var invalidSlideInputMessage = function(_a) {
    var functionName = _a.functionName,
        propertyName = _a.propertyName,
        slideShowId = _a.slideShowId,
        value = _a.value,
        minimum = _a.minimum,
        maximum = _a.maximum;
    return templates.error_slide_input({
        functionName: functionName,
        propertyName: propertyName,
        slideShowId: slideShowId,
        value: value,
        maximum: maximum,
        minimum: minimum,
    });
};
export var invalidImageInGalleryWithIndex = function(_a) {
    var wrongValue = _a.wrongValue,
        propertyName = _a.propertyName,
        index = _a.index;
    return templates.error_bad_image_format_with_index({
        propertyName: propertyName,
        index: index,
        wrongValue: wrongValue,
    });
};
export var invalidSvgValue = function(value) {
    return templates.error_bad_svg_format({
        propertyName: 'src',
        value: value,
    });
};
export var invalidMenuItemMessage = function(_a) {
    var propertyName = _a.propertyName,
        value = _a.value,
        index = _a.index;
    return assert.isNumber(index) ?
        templates.error_bad_menu_item_format_with_index({
            propertyName: propertyName,
            value: value,
            index: index,
        }) :
        templates.error_bad_menu_item_format({
            propertyName: propertyName,
            value: value,
        });
};
export var invalidOption = function(_a) {
    var propertyName = _a.propertyName,
        wrongValue = _a.wrongValue,
        index = _a.index;
    return templates.warning_invalid_option({
        propertyName: propertyName,
        wrongValue: wrongValue,
        index: index,
    });
};
export var onlyGetter = function(_a) {
    var propertyName = _a.propertyName,
        compType = _a.compType;
    return templates.error_only_getter({
        propertyName: propertyName,
        compType: compType,
    });
};
export var invalidFormatMessageWithHint = function(_a) {
    var propertyName = _a.propertyName,
        functionName = _a.functionName,
        wrongValue = _a.wrongValue,
        hint = _a.hint;
    return templates.error_bad_format_with_hint({
        propertyName: propertyName,
        functionName: functionName,
        wrongValue: wrongValue,
        hint: hint,
    });
};
//# sourceMappingURL=messages.js.map