export function composeSDKFactories() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    return function(api) {
        var target = {};
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (var sourceIdx = 0; sourceIdx < sources.length; sourceIdx++) {
            var source = sources[sourceIdx](api);
            var sourceKeys = Object.keys(source);
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (var sourceKeyIdx = 0; sourceKeyIdx < sourceKeys.length; sourceKeyIdx++) {
                var sourceKey = sourceKeys[sourceKeyIdx];
                var sourceProp = Object.getOwnPropertyDescriptor(source, sourceKey);
                Object.defineProperty(target, sourceKey, sourceProp);
            }
        }
        return target;
    };
}
//# sourceMappingURL=composeSDKFactories.js.map