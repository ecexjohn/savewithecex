export var templates = {
    /* prettier-ignore */
    warning_not_null: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName;
        return "The " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to null.";
    },
    /* prettier-ignore */
    warning_non_images_in_gallery: function(_a) {
        var galleryId = _a.galleryId;
        return "Gallery \"" + galleryId + "\" cannot contain items that are not images. To also display video and text, choose a gallery that supports those types.";
    },
    /* prettier-ignore */
    warning_invalid_effect_name: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            effectName = _a.effectName,
            infoLink = _a.infoLink;
        return "The \"" + propertyName + "\" function called on \"" + compName + "\" was executed without the \"" + effectName + "\" effect because it is an invalid effectName value. Read more about effects: \"" + infoLink + "\"')";
    },
    /* prettier-ignore */
    warning_invalid_effect_option: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            effectName = _a.effectName,
            effectOption = _a.effectOption,
            effectOptionRef = _a.effectOptionRef;
        return "The \"" + propertyName + "\" function called on \"" + compName + "\" was executed without the \"" + effectName + "\" effect because it was called with the following invalid effectOptions keys: " + effectOption + ". Read more about the effectOptions object: \"https://www.wix.com/code/reference/$w.EffectOptions.html#" + effectOptionRef + "\"";
    },
    /* prettier-ignore */
    warning_effect_options_not_set: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            infoLink = _a.infoLink;
        return "The \"" + propertyName + "\" function called on \"" + compName + "\" was executed without the specified effect options because it was called without an effect. Read more about effects: \"" + infoLink + "\"')";
    },
    /* prettier-ignore */
    warning_invalid_effect_options: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            effectName = _a.effectName,
            wrongProperty = _a.wrongProperty,
            wrongValue = _a.wrongValue,
            infoLink = _a.infoLink;
        return "The \"" + propertyName + "\" function called on \"" + compName + "\" was executed without the \"" + effectName + "\" effect because it was called with the following invalid effectOptions " + wrongProperty + ": " + wrongValue + ". Read more about the effectOptions object: \"" + infoLink + "\"')";
    },
    /* prettier-ignore */
    warning_deprecated_effect_name: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            effectName = _a.effectName,
            infoLink = _a.infoLink;
        return "The \"" + propertyName + "\" function  called on \"" + compName + "\" was called with the following deprecated effect: \"" + effectName + "\". Read more about effects: \"" + infoLink + "\"')";
    },
    /* prettier-ignore */
    warning_deprecated_effect_with_options: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            effectName = _a.effectName,
            infoLink = _a.infoLink;
        return "The \"" + propertyName + "\" function  called on \"" + compName + "\" was executed without the specified effect options because it was called with the following deprecated effect: \"" + effectName + "\". Read more about effects: \"" + infoLink + "\"";
    },
    /* prettier-ignore */
    error_bad_image_format_with_index: function(_a) {
        var propertyName = _a.propertyName,
            wrongValue = _a.wrongValue,
            index = _a.index;
        return "The \"" + propertyName + "\" property of the item at index " + index + " cannot be set to \"" + wrongValue + "\". It must be a valid URL starting with \"http://\", \"https://\", or \"wix:image://\".";
    },
    /* prettier-ignore */
    warning_not_null_for_comp_name: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            compName = _a.compName;
        return "The " + propertyName + " parameter of \"" + compName + "\" that is passed to the " + functionName + " method cannot be set to null.";
    },
    /* prettier-ignore */
    warning_not_null_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            index = _a.index;
        return "The " + propertyName + " parameter of item at index " + index + " that is passed to the " + functionName + " method cannot be set to null or undefined.";
    },
    /* prettier-ignore */
    warning_invalid_option: function(_a) {
        var propertyName = _a.propertyName,
            wrongValue = _a.wrongValue,
            index = _a.index;
        return "The " + propertyName + " parameter at index " + index + " that is passed to the options function cannot be set to " + JSON.stringify(wrongValue) + ". Options must contain either a non-null value or a non-null label.";
    },
    /* prettier-ignore */
    warning_color_casting_performed: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            infoLink = _a.infoLink;
        return " The value of \"" + propertyName + "\" property of \"" + compName + "\" expects an rgbColor value, but was set to an rgbaColor value. The color value has been set, but the alpha opacity information has been ignored. Read more about rgbColor values: \"" + infoLink + "\"";
    },
    /* prettier-ignore */
    warning_value_changed: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            newValue = _a.newValue,
            changedProperty = _a.changedProperty;
        return "The " + propertyName + " of " + compName + " was set to " + newValue + ", which is less than " + compName + "\\warning_value_changed's " + changedProperty + " value. " + compName + " cannot have a " + changedProperty + " value which is greater than its " + propertyName + " value. The value of " + changedProperty + " has therefore been set to " + newValue + ".";
    },
    /* prettier-ignore */
    error_mandatory_val: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName;
        return "The " + propertyName + " parameter is required for " + functionName + " method.";
    },
    /* prettier-ignore */
    error_mandatory_val_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            index = _a.index;
        return "The " + propertyName + " parameter of item at index " + index + " is required for " + functionName + " method.";
    },
    /* prettier-ignore */
    error_length_in_range: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            minimum = _a.minimum,
            maximum = _a.maximum;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\". Its length must be between " + minimum + " and " + maximum + ".";
    },
    /* prettier-ignore */
    error_length_in_range_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            minimum = _a.minimum,
            maximum = _a.maximum,
            index = _a.index;
        return "The " + propertyName + " parameter of item at index " + index + " that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\". Its length must be between " + minimum + " and " + maximum + ".";
    },
    /* prettier-ignore */
    error_length_accept_single_value: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            expectedValue = _a.expectedValue;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\". Its length must be " + expectedValue + ".";
    },
    /* prettier-ignore */
    error_length_accept_single_value_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            expectedValue = _a.expectedValue,
            index = _a.index;
        return "The " + propertyName + " parameter of item at index " + index + " that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\". Its length must be " + expectedValue + ".";
    },
    /* prettier-ignore */
    error_length_less_than: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            minimum = _a.minimum;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\" because its length is shorter than " + minimum + ".";
    },
    /* prettier-ignore */
    error_length_less_than_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            minimum = _a.minimum,
            index = _a.index;
        return "The " + propertyName + " parameter of item at index " + index + " that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\" because its length is shorter than " + minimum + ".";
    },
    /* prettier-ignore */
    error_length_exceeds: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            maximum = _a.maximum;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\" because its length exceeds " + maximum + ".";
    },
    /* prettier-ignore */
    error_length_exceeds_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            maximum = _a.maximum,
            index = _a.index;
        return "The " + propertyName + " parameter of item at index " + index + " that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\" because its length exceeds " + maximum + ".";
    },
    /* prettier-ignore */
    error_range: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            minimum = _a.minimum,
            maximum = _a.maximum;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\". It must be between " + minimum + " and " + maximum + ".";
    },
    /* prettier-ignore */
    error_range_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            minimum = _a.minimum,
            maximum = _a.maximum,
            index = _a.index;
        return "The " + propertyName + " parameter of item at index " + index + " that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\". It must be between " + minimum + " and " + maximum + ".";
    },
    /* prettier-ignore */
    error_accept_single_value: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            expectedValue = _a.expectedValue;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\". It must be " + expectedValue + ".";
    },
    /* prettier-ignore */
    error_accept_single_value_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            expectedValue = _a.expectedValue,
            index = _a.index;
        return "The " + propertyName + " parameter of item at index " + index + " that is passed to the " + functionName + " method cannot be set to the value \"" + value + "\". It must be " + expectedValue + ".";
    },
    /* prettier-ignore */
    error_larger_than: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            minimum = _a.minimum;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value " + value + ". It must be larger than " + minimum + ".";
    },
    /* prettier-ignore */
    error_larger_than_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            minimum = _a.minimum,
            index = _a.index;
        return "The value of " + propertyName + " parameter of item at " + index + " that is passed to the " + functionName + " method cannot be set to the value " + value + ". It must be larger than " + minimum + ".";
    },
    /* prettier-ignore */
    error_less_than: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            maximum = _a.maximum;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value " + value + ". It must be less than " + maximum + ".";
    },
    /* prettier-ignore */
    error_less_than_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            maximum = _a.maximum,
            index = _a.index;
        return "The value of " + propertyName + " parameter of item at index " + index + " that is passed to the " + functionName + " method cannot be set to the value " + value + ". It must be less than " + maximum + ".";
    },
    /* prettier-ignore */
    error_type: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            expectedType = _a.expectedType;
        return "The " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value " + value + ". It must be of type " + expectedType + ".";
    },
    /* prettier-ignore */
    error_type_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            expectedType = _a.expectedType,
            index = _a.index;
        return "The " + propertyName + " parameter of item at index " + index + " that is passed to the " + functionName + " method cannot be set to the value " + value + ". It must be of type " + expectedType + ".";
    },
    /* prettier-ignore */
    error_bad_format: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value " + value + ". Bad format";
    },
    /* prettier-ignore */
    error_slide_input: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            slideShowId = _a.slideShowId,
            value = _a.value,
            minimum = _a.minimum,
            maximum = _a.maximum;
        return "The \"" + propertyName + "\" parameter that is passed to the \"" + functionName + "\" method cannot be set to the value " + value + ". It must be a slide from the \"" + slideShowId + "\" slideshow or an index between " + minimum + " and " + maximum;
    },
    /* prettier-ignore */
    error_bad_format_with_index: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            value = _a.value,
            index = _a.index;
        return "The \"" + propertyName + "\" property of the item at index " + index + " that is passed to the " + functionName + " method cannot be set to \"" + value + "\". Bad format";
    },
    /* prettier-ignore */
    error_bad_format_with_hint: function(_a) {
        var propertyName = _a.propertyName,
            functionName = _a.functionName,
            wrongValue = _a.wrongValue,
            hint = _a.hint;
        return "The value of " + propertyName + " parameter that is passed to the " + functionName + " method cannot be set to the value " + wrongValue + ". Bad format, must be " + hint + " format.";
    },
    /* prettier-ignore */
    error_bad_svg_format: function(_a) {
        var propertyName = _a.propertyName,
            value = _a.value;
        return ("The \"" + propertyName + "\" property cannot be set to \"" + value + "\". It must be a valid SVG XML string or an SVG source starting with \"http://\", \"https://\", or \"wix:vector://v1/\".");
    },
    /* prettier-ignore */
    error_target_w_photo: function(_a) {
        var target = _a.target;
        return ("The target parameter that is passed to the target method cannot be set to the value " + target + ". It must be of type from (_blank,_self).");
    },
    /* prettier-ignore */
    error_bad_menu_item_format: function(_a) {
        var propertyName = _a.propertyName,
            value = _a.value;
        return "The \"" + propertyName + "\" property cannot be set to \"" + value + "\". It must be a valid URL starting with \"http://\", \"https://\", \"image://\", \"wix:image://v1\" or \"wix:vector://v1/svgshape.v2\".";
    },
    /* prettier-ignore */
    error_bad_menu_item_format_with_index: function(_a) {
        var propertyName = _a.propertyName,
            value = _a.value,
            index = _a.index;
        return "The \"" + propertyName + "\" property of the item at index " + index + " cannot be set to \"" + value + "\". It must be a valid URL starting with \"http://\", \"https://\", \"image://\", \"wix:image://v1\" or \"wix:vector://v1/svgshape.v2\"";
    },
    /* prettier-ignore */
    error_invalid_css_value: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            cssProperty = _a.cssProperty,
            exampleFormat = _a.exampleFormat,
            infoLink = _a.infoLink;
        return " The \"" + propertyName + "\" property of \"" + compName + "\" was set to an invalid \"" + cssProperty + "\" value. The value is expected in the following format:\"" + exampleFormat + "\". Read more about \"" + cssProperty + "\" values: \"" + infoLink + "\"";
    },
    /* prettier-ignore */
    error_invalid_css_value_multiple_expected_formats: function(_a) {
        var propertyName = _a.propertyName,
            compName = _a.compName,
            cssProperty = _a.cssProperty,
            exampleFormats = _a.exampleFormats,
            infoLink = _a.infoLink;
        return " The \"" + propertyName + "\" property of \"" + compName + "\" was set to an invalid \"" + cssProperty + "\" value. The value is expected in one of the following formats:\"" + exampleFormats + "\". Read more about \"" + cssProperty + "\" values: \"" + infoLink + "\"";
    },
    /* prettier-ignore */
    error_invalid_location: function(_a) {
        var propertyName = _a.propertyName,
            index = _a.index,
            wrongValue = _a.wrongValue;
        return "The " + propertyName + " parameter at index " + index + " that is passed to the markers function cannot be set to " + wrongValue + ". You need to set either location object {longitude, latitude}, or a valid address - placeId.";
    },
    /* prettier-ignore */
    error_invalid_markers: function(_a) {
        var wrongValue = _a.wrongValue;
        return "The markers property cannot be set to " + wrongValue + ". You need to set at least one marker in the array.";
    },
    /* prettier-ignore */
    error_only_getter: function(_a) {
        var propertyName = _a.propertyName,
            compType = _a.compType;
        return "Cannot set property " + propertyName + " of " + compType + " which has only a getter.";
    },
    /* prettier-ignore */
    error_invalid_url: function(_a) {
        var url = _a.url,
            type = _a.type,
            prefix = _a.prefix;
        return "The \"src\" property cannot be set to \"" + url + "\". It must be a valid URL starting with \"http://\", \"https://\", or a valid " + type + " URL starting with " + prefix + ".";
    }
};
//# sourceMappingURL=messageTemplates.js.map