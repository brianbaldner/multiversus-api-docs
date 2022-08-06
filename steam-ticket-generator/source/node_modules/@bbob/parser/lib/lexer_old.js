"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createLexer = exports.createTokenOfType = void 0;
var _char = require("@bbob/plugin-helper/lib/char");
var _token = require("./Token");
var _utils = require("./utils");
// for cases <!-- -->
var EM = '!';
/**
 * Creates a Token entity class
 * @param {String} type
 * @param {String} value
 * @param {Number} r line number
 * @param {Number} cl char number in line
 */ var createToken = function(type, value, param, param1) {
    var r = param === void 0 ? 0 : param, cl = param1 === void 0 ? 0 : param1;
    return new _token.Token(type, value, r, cl);
};
/**
 * @typedef {Object} Lexer
 * @property {Function} tokenize
 * @property {Function} isTokenNested
 */ /**
 * @param {String} buffer
 * @param {Object} options
 * @param {Function} options.onToken
 * @param {String} options.openTag
 * @param {String} options.closeTag
 * @param {Boolean} options.enableEscapeTags
 * @return {Lexer}
 */ function createLexer(buffer, param) {
    var options = param === void 0 ? {
    } : param;
    var row = 0;
    var col = 0;
    var tokenIndex = -1;
    var tokens = new Array(Math.floor(buffer.length));
    var openTag = options.openTag || _char.OPEN_BRAKET;
    var closeTag = options.closeTag || _char.CLOSE_BRAKET;
    var escapeTags = options.enableEscapeTags;
    var RESERVED_CHARS = [
        closeTag,
        openTag,
        _char.QUOTEMARK,
        _char.BACKSLASH,
        _char.SPACE,
        _char.TAB,
        _char.EQ,
        _char.N,
        EM
    ];
    var NOT_CHAR_TOKENS = [
        // ...(options.enableEscapeTags ? [BACKSLASH] : []),
        openTag,
        _char.SPACE,
        _char.TAB,
        _char.N, 
    ];
    var WHITESPACES = [
        _char.SPACE,
        _char.TAB
    ];
    var SPECIAL_CHARS = [
        _char.EQ,
        _char.SPACE,
        _char.TAB
    ];
    var isCharReserved = function(char) {
        return RESERVED_CHARS.indexOf(char) >= 0;
    };
    var isWhiteSpace = function(char) {
        return WHITESPACES.indexOf(char) >= 0;
    };
    var isCharToken = function(char) {
        return NOT_CHAR_TOKENS.indexOf(char) === -1;
    };
    var isSpecialChar = function(char) {
        return SPECIAL_CHARS.indexOf(char) >= 0;
    };
    var isEscapableChar = function(char) {
        return char === openTag || char === closeTag || char === _char.BACKSLASH;
    };
    var isEscapeChar = function(char) {
        return char === _char.BACKSLASH;
    };
    /**
   * Emits newly created token to subscriber
   * @param token
   */ var emitToken = function(token) {
        if (options.onToken) {
            options.onToken(token);
        }
        tokenIndex += 1;
        tokens[tokenIndex] = token;
    };
    /**
   * Parses params inside [myTag---params goes here---]content[/myTag]
   * @param str
   * @returns {{tag: *, attrs: Array}}
   */ var parseAttrs = function(str) {
        var tagName = null;
        var skipSpecialChars = false;
        var attrTokens = [];
        var attrCharGrabber = (0, _utils).createCharGrabber(str);
        var validAttr = function(char) {
            var isEQ = char === _char.EQ;
            var isWS = isWhiteSpace(char);
            var prevChar = attrCharGrabber.getPrev();
            var nextChar = attrCharGrabber.getNext();
            var isPrevSLASH = prevChar === _char.BACKSLASH;
            var isTagNameEmpty = tagName === null;
            if (isTagNameEmpty) {
                return (isEQ || isWS || attrCharGrabber.isLast()) === false;
            }
            if (skipSpecialChars && isSpecialChar(char)) {
                return true;
            }
            if (char === _char.QUOTEMARK && !isPrevSLASH) {
                skipSpecialChars = !skipSpecialChars;
                if (!skipSpecialChars && !(nextChar === _char.EQ || isWhiteSpace(nextChar))) {
                    return false;
                }
            }
            return (isEQ || isWS) === false;
        };
        var nextAttr = function() {
            var attrStr = attrCharGrabber.grabWhile(validAttr);
            var currChar = attrCharGrabber.getCurr();
            // first string before space is a tag name [tagName params...]
            if (tagName === null) {
                tagName = attrStr;
            } else if (isWhiteSpace(currChar) || currChar === _char.QUOTEMARK || !attrCharGrabber.hasNext()) {
                var escaped = (0, _utils).unquote((0, _utils).trimChar(attrStr, _char.QUOTEMARK));
                attrTokens.push(createToken(_token.TYPE_ATTR_VALUE, escaped, row, col));
            } else {
                attrTokens.push(createToken(_token.TYPE_ATTR_NAME, attrStr, row, col));
            }
            attrCharGrabber.skip();
        };
        while(attrCharGrabber.hasNext()){
            nextAttr();
        }
        return {
            tag: tagName,
            attrs: attrTokens
        };
    };
    var bufferGrabber = (0, _utils).createCharGrabber(buffer, {
        onSkip: function() {
            col++;
        }
    });
    var next = function() {
        var currChar = bufferGrabber.getCurr();
        var nextChar = bufferGrabber.getNext();
        if (currChar === _char.N) {
            bufferGrabber.skip();
            col = 0;
            row++;
            emitToken(createToken(_token.TYPE_NEW_LINE, currChar, row, col));
        } else if (isWhiteSpace(currChar)) {
            var str = bufferGrabber.grabWhile(isWhiteSpace);
            emitToken(createToken(_token.TYPE_SPACE, str, row, col));
        } else if (escapeTags && isEscapeChar(currChar) && isEscapableChar(nextChar)) {
            bufferGrabber.skip(); // skip the \ without emitting anything
            bufferGrabber.skip(); // skip past the [, ] or \ as well
            emitToken(createToken(_token.TYPE_WORD, nextChar, row, col));
        } else if (currChar === openTag) {
            bufferGrabber.skip(); // skip openTag
            // detect case where we have '[My word [tag][/tag]' or we have '[My last line word'
            var substr = bufferGrabber.substrUntilChar(closeTag);
            var hasInvalidChars = substr.length === 0 || substr.indexOf(openTag) >= 0;
            if (isCharReserved(nextChar) || hasInvalidChars || bufferGrabber.isLast()) {
                emitToken(createToken(_token.TYPE_WORD, currChar, row, col));
            } else {
                var str = bufferGrabber.grabWhile(function(val) {
                    return val !== closeTag;
                });
                bufferGrabber.skip(); // skip closeTag
                // [myTag   ]
                var isNoAttrsInTag = str.indexOf(_char.EQ) === -1;
                // [/myTag]
                var isClosingTag = str[0] === _char.SLASH;
                if (isNoAttrsInTag || isClosingTag) {
                    emitToken(createToken(_token.TYPE_TAG, str, row, col));
                } else {
                    var parsed = parseAttrs(str);
                    emitToken(createToken(_token.TYPE_TAG, parsed.tag, row, col));
                    parsed.attrs.map(emitToken);
                }
            }
        } else if (currChar === closeTag) {
            bufferGrabber.skip(); // skip closeTag
            emitToken(createToken(_token.TYPE_WORD, currChar, row, col));
        } else if (isCharToken(currChar)) {
            if (escapeTags && isEscapeChar(currChar) && !isEscapableChar(nextChar)) {
                bufferGrabber.skip();
                emitToken(createToken(_token.TYPE_WORD, currChar, row, col));
            } else {
                var str = bufferGrabber.grabWhile(function(char) {
                    if (escapeTags) {
                        return isCharToken(char) && !isEscapeChar(char);
                    }
                    return isCharToken(char);
                });
                emitToken(createToken(_token.TYPE_WORD, str, row, col));
            }
        }
    };
    var tokenize = function() {
        while(bufferGrabber.hasNext()){
            next();
        }
        tokens.length = tokenIndex + 1;
        return tokens;
    };
    var isTokenNested = function(token) {
        var value = openTag + _char.SLASH + token.getValue();
        // potential bottleneck
        return buffer.indexOf(value) > -1;
    };
    return {
        tokenize: tokenize,
        isTokenNested: isTokenNested
    };
}
var createTokenOfType = createToken;
exports.createTokenOfType = createTokenOfType;
exports.createLexer = createLexer;
