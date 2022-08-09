"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.set = void 0;
const registry = {};
const set = (key, value) => {
    registry[key] = value;
};
exports.set = set;
const get = (key) => {
    return registry[key];
};
exports.get = get;
