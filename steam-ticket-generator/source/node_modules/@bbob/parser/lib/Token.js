"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.Token = exports.TYPE_NEW_LINE = exports.TYPE_SPACE = exports.TYPE_ATTR_VALUE = exports.TYPE_ATTR_NAME = exports.TYPE_TAG = exports.TYPE_WORD = exports.COLUMN_ID = exports.LINE_ID = exports.VALUE_ID = exports.TYPE_ID = void 0;
var _char = require("@bbob/plugin-helper/lib/char");
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// type, value, line, row,
var TOKEN_TYPE_ID = 'type'; // 0;
var TOKEN_VALUE_ID = 'value'; // 1;
var TOKEN_COLUMN_ID = 'row'; // 2;
var TOKEN_LINE_ID = 'line'; // 3;
var TOKEN_TYPE_WORD = 1; // 'word';
var TOKEN_TYPE_TAG = 2; // 'tag';
var TOKEN_TYPE_ATTR_NAME = 3; // 'attr-name';
var TOKEN_TYPE_ATTR_VALUE = 4; // 'attr-value';
var TOKEN_TYPE_SPACE = 5; // 'space';
var TOKEN_TYPE_NEW_LINE = 6; // 'new-line';
/**
 * @param {Token} token
 * @returns {string}
 */ var getTokenValue = function(token) {
    if (token && typeof token[TOKEN_VALUE_ID] !== 'undefined') {
        return token[TOKEN_VALUE_ID];
    }
    return '';
};
/**
 * @param {Token}token
 * @returns {number}
 */ var getTokenLine = function(token) {
    return token && token[TOKEN_LINE_ID] || 0;
};
var getTokenColumn = function(token) {
    return token && token[TOKEN_COLUMN_ID] || 0;
};
/**
 * @param {Token} token
 * @returns {boolean}
 */ var isTextToken = function(token) {
    if (token && typeof token[TOKEN_TYPE_ID] !== 'undefined') {
        return token[TOKEN_TYPE_ID] === TOKEN_TYPE_SPACE || token[TOKEN_TYPE_ID] === TOKEN_TYPE_NEW_LINE || token[TOKEN_TYPE_ID] === TOKEN_TYPE_WORD;
    }
    return false;
};
/**
 * @param {Token} token
 * @returns {boolean}
 */ var isTagToken = function(token) {
    if (token && typeof token[TOKEN_TYPE_ID] !== 'undefined') {
        return token[TOKEN_TYPE_ID] === TOKEN_TYPE_TAG;
    }
    return false;
};
var isTagEnd = function(token) {
    return getTokenValue(token).charCodeAt(0) === _char.SLASH.charCodeAt(0);
};
var isTagStart = function(token) {
    return !isTagEnd(token);
};
var isAttrNameToken = function(token) {
    if (token && typeof token[TOKEN_TYPE_ID] !== 'undefined') {
        return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_NAME;
    }
    return false;
};
/**
 * @param {Token} token
 * @returns {boolean}
 */ var isAttrValueToken = function(token) {
    if (token && typeof token[TOKEN_TYPE_ID] !== 'undefined') {
        return token[TOKEN_TYPE_ID] === TOKEN_TYPE_ATTR_VALUE;
    }
    return false;
};
var getTagName = function(token) {
    var value = getTokenValue(token);
    return isTagEnd(token) ? value.slice(1) : value;
};
var convertTagToText = function(token) {
    var text = _char.OPEN_BRAKET;
    text += getTokenValue(token);
    text += _char.CLOSE_BRAKET;
    return text;
};
var Token = /*#__PURE__*/ function() {
    "use strict";
    function Token(type, value, line, row) {
        _classCallCheck(this, Token);
        this[TOKEN_TYPE_ID] = Number(type);
        this[TOKEN_VALUE_ID] = String(value);
        this[TOKEN_LINE_ID] = Number(line);
        this[TOKEN_COLUMN_ID] = Number(row);
    }
    _createClass(Token, [
        {
            key: "isEmpty",
            value: function isEmpty() {
                // eslint-disable-next-line no-restricted-globals
                return isNaN(this[TOKEN_TYPE_ID]);
            }
        },
        {
            key: "isText",
            value: function isText() {
                return isTextToken(this);
            }
        },
        {
            key: "isTag",
            value: function isTag() {
                return isTagToken(this);
            }
        },
        {
            key: "isAttrName",
            value: function isAttrName() {
                return isAttrNameToken(this);
            }
        },
        {
            key: "isAttrValue",
            value: function isAttrValue() {
                return isAttrValueToken(this);
            }
        },
        {
            key: "isStart",
            value: function isStart() {
                return isTagStart(this);
            }
        },
        {
            key: "isEnd",
            value: function isEnd() {
                return isTagEnd(this);
            }
        },
        {
            key: "getName",
            value: function getName() {
                return getTagName(this);
            }
        },
        {
            key: "getValue",
            value: function getValue() {
                return getTokenValue(this);
            }
        },
        {
            key: "getLine",
            value: function getLine() {
                return getTokenLine(this);
            }
        },
        {
            key: "getColumn",
            value: function getColumn() {
                return getTokenColumn(this);
            }
        },
        {
            key: "toString",
            value: function toString() {
                return convertTagToText(this);
            }
        }
    ]);
    return Token;
}();
var TYPE_ID = TOKEN_TYPE_ID;
exports.TYPE_ID = TYPE_ID;
var VALUE_ID = TOKEN_VALUE_ID;
exports.VALUE_ID = VALUE_ID;
var LINE_ID = TOKEN_LINE_ID;
exports.LINE_ID = LINE_ID;
var COLUMN_ID = TOKEN_COLUMN_ID;
exports.COLUMN_ID = COLUMN_ID;
var TYPE_WORD = TOKEN_TYPE_WORD;
exports.TYPE_WORD = TYPE_WORD;
var TYPE_TAG = TOKEN_TYPE_TAG;
exports.TYPE_TAG = TYPE_TAG;
var TYPE_ATTR_NAME = TOKEN_TYPE_ATTR_NAME;
exports.TYPE_ATTR_NAME = TYPE_ATTR_NAME;
var TYPE_ATTR_VALUE = TOKEN_TYPE_ATTR_VALUE;
exports.TYPE_ATTR_VALUE = TYPE_ATTR_VALUE;
var TYPE_SPACE = TOKEN_TYPE_SPACE;
exports.TYPE_SPACE = TYPE_SPACE;
var TYPE_NEW_LINE = TOKEN_TYPE_NEW_LINE;
exports.TYPE_NEW_LINE = TYPE_NEW_LINE;
exports.Token = Token;
var _default = Token;
exports.default = _default;
