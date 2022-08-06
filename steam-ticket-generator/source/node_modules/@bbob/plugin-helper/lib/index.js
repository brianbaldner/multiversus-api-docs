"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isEOL = exports.isStringNode = exports.isTagNode = exports.getUniqAttr = exports.getNodeLength = exports.escapeHTML = exports.appendToNode = exports.attrValue = exports.attrsToString = void 0;
var _char = require("./char");
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = new Array(arr.length); i < arr.length; i++){
            arr2[i] = arr[i];
        }
        return arr2;
    }
}
function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
var _typeof = function(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
var isTagNode = function(el) {
    return typeof el === 'object' && !!el.tag;
};
var isStringNode = function(el) {
    return typeof el === 'string';
};
var isEOL = function(el) {
    return el === _char.N;
};
var keysReduce = function(obj, reduce, def) {
    return Object.keys(obj).reduce(reduce, def);
};
var getNodeLength = function(node) {
    if (isTagNode(node)) {
        return node.content.reduce(function(count, contentNode) {
            return count + getNodeLength(contentNode);
        }, 0);
    }
    if (isStringNode(node)) {
        return node.length;
    }
    return 0;
};
/**
 * Appends value to Tag Node
 * @param {TagNode} node
 * @param value
 */ var appendToNode = function(node, value) {
    node.content.push(value);
};
/**
 * Replaces " to &qquot;
 * @param {String} value
 */ var escapeHTML = function(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')// eslint-disable-next-line no-script-url
    .replace(/(javascript):/gi, '$1%3A');
};
/**
 * Acept name and value and return valid html5 attribute string
 * @param {String} name
 * @param {String} value
 * @return {string}
 */ var attrValue = function(name, value) {
    var type = typeof value === "undefined" ? "undefined" : _typeof(value);
    var types = {
        boolean: function() {
            return value ? "".concat(name) : '';
        },
        number: function() {
            return "".concat(name, "=\"").concat(value, "\"");
        },
        string: function() {
            return "".concat(name, "=\"").concat(escapeHTML(value), "\"");
        },
        object: function() {
            return "".concat(name, "=\"").concat(escapeHTML(JSON.stringify(value)), "\"");
        }
    };
    return types[type] ? types[type]() : '';
};
/**
 * Transforms attrs to html params string
 * @param values
 */ var attrsToString = function(values) {
    // To avoid some malformed attributes
    if (values == null) {
        return '';
    }
    return keysReduce(values, function(arr, key) {
        return _toConsumableArray(arr).concat([
            attrValue(key, values[key])
        ]);
    }, [
        ''
    ]).join(' ');
};
/**
 * Gets value from
 * @example
 * getUniqAttr({ 'foo': true, 'bar': bar' }) => 'bar'
 * @param attrs
 * @returns {string}
 */ var getUniqAttr = function(attrs) {
    return keysReduce(attrs, function(res, key) {
        return attrs[key] === key ? attrs[key] : null;
    }, null);
};
exports.attrsToString = attrsToString;
exports.attrValue = attrValue;
exports.appendToNode = appendToNode;
exports.escapeHTML = escapeHTML;
exports.getNodeLength = getNodeLength;
exports.getUniqAttr = getUniqAttr;
exports.isTagNode = isTagNode;
exports.isStringNode = isStringNode;
exports.isEOL = isEOL;
