import { OPEN_BRAKET, CLOSE_BRAKET, SLASH } from '@bbob/plugin-helper/lib/char';
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
    return getTokenValue(token).charCodeAt(0) === SLASH.charCodeAt(0);
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
    var text = OPEN_BRAKET;
    text += getTokenValue(token);
    text += CLOSE_BRAKET;
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
export var TYPE_ID = TOKEN_TYPE_ID;
export var VALUE_ID = TOKEN_VALUE_ID;
export var LINE_ID = TOKEN_LINE_ID;
export var COLUMN_ID = TOKEN_COLUMN_ID;
export var TYPE_WORD = TOKEN_TYPE_WORD;
export var TYPE_TAG = TOKEN_TYPE_TAG;
export var TYPE_ATTR_NAME = TOKEN_TYPE_ATTR_NAME;
export var TYPE_ATTR_VALUE = TOKEN_TYPE_ATTR_VALUE;
export var TYPE_SPACE = TOKEN_TYPE_SPACE;
export var TYPE_NEW_LINE = TOKEN_TYPE_NEW_LINE;
export { Token };
export default Token;
