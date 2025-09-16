"use strict";

class checker {

    ensureNumber(value) {
        return Number(value);
    }

    ensureBoolean(value) {
        return Boolean(value);
    }

    isNumber(value) {
        return typeof value === 'number';
    }

    isBoolean(value) {
        return typeof value === 'boolean';
    }
}
module.exports = checker;