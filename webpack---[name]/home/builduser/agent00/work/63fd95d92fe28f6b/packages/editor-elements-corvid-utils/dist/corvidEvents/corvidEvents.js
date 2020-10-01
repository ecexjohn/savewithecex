export var convertToCorvidEvent = function(event) {
    var target = event.target,
        type = event.type,
        context = event.context;
    return {
        target: target,
        type: type,
        context: context
    };
};
export var convertToCorvidMouseEvent = function(event) {
    var clientX = event.clientX,
        clientY = event.clientY,
        pageX = event.pageX,
        pageY = event.pageY,
        screenX = event.screenX,
        screenY = event.screenY,
        target = event.target,
        type = event.type,
        context = event.context,
        nativeEvent = event.nativeEvent;
    var offsetX = nativeEvent.offsetX,
        offsetY = nativeEvent.offsetY;
    return {
        clientX: clientX,
        clientY: clientY,
        pageX: pageX,
        pageY: pageY,
        screenX: screenX,
        screenY: screenY,
        target: target,
        type: type,
        context: context,
        offsetX: offsetX,
        offsetY: offsetY,
    };
};
export var convertToCorvidKeyboardEvent = function(event) {
    var altKey = event.altKey,
        ctrlKey = event.ctrlKey,
        key = event.key,
        metaKey = event.metaKey,
        shiftKey = event.shiftKey,
        target = event.target,
        type = event.type,
        context = event.context;
    return {
        altKey: altKey,
        ctrlKey: ctrlKey,
        key: key,
        metaKey: metaKey,
        shiftKey: shiftKey,
        target: target,
        type: type,
        context: context,
    };
};
//# sourceMappingURL=corvidEvents.js.map