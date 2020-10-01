var duration = {
    type: ['number', 'nil'],
    minimum: 0,
    maximum: 4000
};
var delay = {
    type: ['number', 'nil'],
    minimum: 0,
    maximum: 8000
};
var direction = {
    type: ['string', 'nil'],
    enum: ['left', 'right', 'top', 'bottom'],
};
export var effectsValidationSchema = {
    arc: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: {
                type: ['string', 'nil'],
                enum: ['left', 'right'],
            },
        },
    },
    bounce: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: {
                type: ['string', 'nil'],
                enum: ['topLeft', 'topRight', 'bottomRight', 'bottomLeft', 'center'],
            },
            intensity: {
                type: ['string', 'nil'],
                enum: ['soft', 'medium', 'hard'],
            },
        },
    },
    puff: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
        },
    },
    zoom: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
        },
    },
    fade: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
        },
    },
    flip: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: direction,
        },
    },
    float: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: direction,
        },
    },
    fly: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: direction,
        },
    },
    fold: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: direction,
        },
    },
    glide: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            angle: {
                type: ['number', 'nil'],
                minimum: 0,
                maximum: 360,
            },
            distance: {
                type: ['number', 'nil'],
                minimum: 0,
                maximum: 300,
            },
        },
    },
    roll: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: direction,
        },
    },
    slide: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: direction,
        },
    },
    spin: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: {
                type: ['string', 'nil'],
                enum: ['cw', 'ccw'],
            },
            cycles: {
                type: ['number', 'nil'],
                minimum: 1,
                maximum: 15,
            },
        },
    },
    turn: {
        type: ['object'],
        properties: {
            duration: duration,
            delay: delay,
            direction: {
                type: ['string', 'nil'],
                enum: ['right', 'left'],
            },
        },
    },
};
//# sourceMappingURL=effectValidationSchema.js.map