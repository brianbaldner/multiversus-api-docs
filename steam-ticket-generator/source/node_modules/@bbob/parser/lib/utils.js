"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createList = exports.unquote = exports.trimChar = exports.createCharGrabber = void 0;
var _char = require("@bbob/plugin-helper/lib/char");
function CharGrabber(source, options) {
    var cursor = {
        pos: 0,
        len: source.length
    };
    var substrUntilChar = function(char) {
        var pos = cursor.pos;
        var idx = source.indexOf(char, pos);
        return idx >= 0 ? source.substr(pos, idx - pos) : '';
    };
    var includes = function(val) {
        return source.indexOf(val, cursor.pos) >= 0;
    };
    var hasNext = function() {
        return cursor.len > cursor.pos;
    };
    var isLast = function() {
        return cursor.pos === cursor.len;
    };
    var skip = function(param, silent) {
        var num = param === void 0 ? 1 : param;
        cursor.pos += num;
        if (options && options.onSkip && !silent) {
            options.onSkip();
        }
    };
    var rest = function() {
        return source.substr(cursor.pos);
    };
    var curr = function() {
        return source[cursor.pos];
    };
    var prev = function() {
        var prevPos = cursor.pos - 1;
        return typeof source[prevPos] !== 'undefined' ? source[prevPos] : null;
    };
    var next = function() {
        var nextPos = cursor.pos + 1;
        return nextPos <= source.length - 1 ? source[nextPos] : null;
    };
    var grabWhile = function(cond, silent) {
        var start = 0;
        if (hasNext()) {
            start = cursor.pos;
            while(hasNext() && cond(curr())){
                skip(1, silent);
            }
        }
        return source.substr(start, cursor.pos - start);
    };
    /**
   * @type {skip}
   */ this.skip = skip;
    /**
   * @returns {Boolean}
   */ this.hasNext = hasNext;
    /**
   * @returns {String}
   */ this.getCurr = curr;
    /**
   * @returns {String}
   */ this.getRest = rest;
    /**
   * @returns {String}
   */ this.getNext = next;
    /**
   * @returns {String}
   */ this.getPrev = prev;
    /**
   * @returns {Boolean}
   */ this.isLast = isLast;
    /**
   * @returns {Boolean}
   */ this.includes = includes;
    /**
   * @param {Function} cond
   * @param {Boolean} silent
   * @return {String}
   */ this.grabWhile = grabWhile;
    /**
   * Grabs rest of string until it find a char
   * @param {String} char
   * @return {String}
   */ this.substrUntilChar = substrUntilChar;
}
var createCharGrabber = function(source, options) {
    return new CharGrabber(source, options);
};
exports.createCharGrabber = createCharGrabber;
var trimChar = function(str, charToRemove) {
    while(str.charAt(0) === charToRemove){
        // eslint-disable-next-line no-param-reassign
        str = str.substring(1);
    }
    while(str.charAt(str.length - 1) === charToRemove){
        // eslint-disable-next-line no-param-reassign
        str = str.substring(0, str.length - 1);
    }
    return str;
};
exports.trimChar = trimChar;
var unquote = function(str) {
    return str.replace(_char.BACKSLASH + _char.QUOTEMARK, _char.QUOTEMARK);
};
exports.unquote = unquote;
function NodeList(param) {
    var values = param === void 0 ? [] : param;
    var nodes = values;
    var getLast = function() {
        return Array.isArray(nodes) && nodes.length > 0 && typeof nodes[nodes.length - 1] !== 'undefined' ? nodes[nodes.length - 1] : null;
    };
    var flushLast = function() {
        return nodes.length ? nodes.pop() : false;
    };
    var push = function(value) {
        return nodes.push(value);
    };
    var toArray = function() {
        return nodes;
    };
    this.push = push;
    this.toArray = toArray;
    this.getLast = getLast;
    this.flushLast = flushLast;
}
var createList = function(param) {
    var values = param === void 0 ? [] : param;
    return new NodeList(values);
};
exports.createList = createList;
