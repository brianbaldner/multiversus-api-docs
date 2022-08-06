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
 * @param {Number} type
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
    var emitToken = /**
   * Emits newly created token to subscriber
   * @param {Number} type
   * @param {String} value
   */ function emitToken(type, value) {
        var token = createToken(type, value, row, col);
        onToken(token);
        tokenIndex += 1;
        tokens[tokenIndex] = token;
    };
    var nextTagState = function nextTagState(tagChars, isSingleValueTag) {
        if (tagMode === TAG_STATE_ATTR) {
            var validAttrName = function(char) {
                return !(char === _char.EQ || isWhiteSpace(char));
            };
            var name = tagChars.grabWhile(validAttrName);
            var isEnd = tagChars.isLast();
            var isValue = tagChars.getCurr() !== _char.EQ;
            tagChars.skip();
            if (isEnd || isValue) {
                emitToken(_token.TYPE_ATTR_VALUE, unq(name));
            } else {
                emitToken(_token.TYPE_ATTR_NAME, name);
            }
            if (isEnd) {
                return TAG_STATE_NAME;
            }
            if (isValue) {
                return TAG_STATE_ATTR;
            }
            return TAG_STATE_VALUE;
        }
        if (tagMode === TAG_STATE_VALUE) {
            var stateSpecial = false;
            var validAttrValue = function(char) {
                // const isEQ = char === EQ;
                var isQM = char === _char.QUOTEMARK;
                var prevChar = tagChars.getPrev();
                var nextChar = tagChars.getNext();
                var isPrevSLASH = prevChar === _char.BACKSLASH;
                var isNextEQ = nextChar === _char.EQ;
                var isWS = isWhiteSpace(char);
                // const isPrevWS = isWhiteSpace(prevChar);
                var isNextWS = isWhiteSpace(nextChar);
                if (stateSpecial && isSpecialChar(char)) {
                    return true;
                }
                if (isQM && !isPrevSLASH) {
                    stateSpecial = !stateSpecial;
                    if (!stateSpecial && !(isNextEQ || isNextWS)) {
                        return false;
                    }
                }
                if (!isSingleValueTag) {
                    return isWS === false;
                // return (isEQ || isWS) === false;
                }
                return true;
            };
            var name = tagChars.grabWhile(validAttrValue);
            tagChars.skip();
            emitToken(_token.TYPE_ATTR_VALUE, unq(name));
            if (tagChars.isLast()) {
                return TAG_STATE_NAME;
            }
            return TAG_STATE_ATTR;
        }
        var validName = function(char) {
            return !(char === _char.EQ || isWhiteSpace(char) || tagChars.isLast());
        };
        var name = tagChars.grabWhile(validName);
        emitToken(_token.TYPE_TAG, name);
        tagChars.skip();
        // in cases when we has [url=someval]GET[/url] and we dont need to parse all
        if (isSingleValueTag) {
            return TAG_STATE_VALUE;
        }
        var hasEQ = tagChars.includes(_char.EQ);
        return hasEQ ? TAG_STATE_ATTR : TAG_STATE_VALUE;
    };
    var stateTag = function stateTag() {
        var currChar = chars.getCurr();
        if (currChar === openTag) {
            var nextChar = chars.getNext();
            chars.skip();
            // detect case where we have '[My word [tag][/tag]' or we have '[My last line word'
            var substr = chars.substrUntilChar(closeTag);
            var hasInvalidChars = substr.length === 0 || substr.indexOf(openTag) >= 0;
            if (isCharReserved(nextChar) || hasInvalidChars || chars.isLast()) {
                emitToken(_token.TYPE_WORD, currChar);
                return STATE_WORD;
            }
            // [myTag   ]
            var isNoAttrsInTag = substr.indexOf(_char.EQ) === -1;
            // [/myTag]
            var isClosingTag = substr[0] === _char.SLASH;
            if (isNoAttrsInTag || isClosingTag) {
                var name = chars.grabWhile(function(char) {
                    return char !== closeTag;
                });
                chars.skip(); // skip closeTag
                emitToken(_token.TYPE_TAG, name);
                return STATE_WORD;
            }
            return STATE_TAG_ATTRS;
        }
        return STATE_WORD;
    };
    var stateAttrs = function stateAttrs() {
        var silent = true;
        var tagStr = chars.grabWhile(function(char) {
            return char !== closeTag;
        }, silent);
        var tagGrabber = (0, _utils).createCharGrabber(tagStr, {
            onSkip: onSkip
        });
        var hasSpace = tagGrabber.includes(_char.SPACE);
        tagMode = TAG_STATE_NAME;
        while(tagGrabber.hasNext()){
            tagMode = nextTagState(tagGrabber, !hasSpace);
        }
        chars.skip(); // skip closeTag
        return STATE_WORD;
    };
    var stateWord = function stateWord() {
        if (isNewLine(chars.getCurr())) {
            emitToken(_token.TYPE_NEW_LINE, chars.getCurr());
            chars.skip();
            col = 0;
            row++;
            return STATE_WORD;
        }
        if (isWhiteSpace(chars.getCurr())) {
            emitToken(_token.TYPE_SPACE, chars.grabWhile(isWhiteSpace));
            return STATE_WORD;
        }
        if (chars.getCurr() === openTag) {
            if (chars.includes(closeTag)) {
                return STATE_TAG;
            }
            emitToken(_token.TYPE_WORD, chars.getCurr());
            chars.skip();
            return STATE_WORD;
        }
        if (escapeTags) {
            if (isEscapeChar(chars.getCurr())) {
                var currChar = chars.getCurr();
                var nextChar = chars.getNext();
                chars.skip(); // skip the \ without emitting anything
                if (isEscapableChar(nextChar)) {
                    chars.skip(); // skip past the [, ] or \ as well
                    emitToken(_token.TYPE_WORD, nextChar);
                    return STATE_WORD;
                }
                emitToken(_token.TYPE_WORD, currChar);
                return STATE_WORD;
            }
            var isChar = function(char) {
                return isCharToken(char) && !isEscapeChar(char);
            };
            emitToken(_token.TYPE_WORD, chars.grabWhile(isChar));
            return STATE_WORD;
        }
        emitToken(_token.TYPE_WORD, chars.grabWhile(isCharToken));
        return STATE_WORD;
    };
    var tokenize = function tokenize() {
        stateMode = STATE_WORD;
        while(chars.hasNext()){
            switch(stateMode){
                case STATE_TAG:
                    stateMode = stateTag();
                    break;
                case STATE_TAG_ATTRS:
                    stateMode = stateAttrs();
                    break;
                case STATE_WORD:
                    stateMode = stateWord();
                    break;
                default:
                    stateMode = STATE_WORD;
                    break;
            }
        }
        tokens.length = tokenIndex + 1;
        return tokens;
    };
    var isTokenNested = function isTokenNested(token) {
        var value = openTag + _char.SLASH + token.getValue();
        // potential bottleneck
        return buffer.indexOf(value) > -1;
    };
    var STATE_WORD = 0;
    var STATE_TAG = 1;
    var STATE_TAG_ATTRS = 2;
    var TAG_STATE_NAME = 0;
    var TAG_STATE_ATTR = 1;
    var TAG_STATE_VALUE = 2;
    var row = 0;
    var col = 0;
    var tokenIndex = -1;
    var stateMode = STATE_WORD;
    var tagMode = TAG_STATE_NAME;
    var tokens = new Array(Math.floor(buffer.length));
    var openTag = options.openTag || _char.OPEN_BRAKET;
    var closeTag = options.closeTag || _char.CLOSE_BRAKET;
    var escapeTags = !!options.enableEscapeTags;
    var onToken = options.onToken || function() {
    };
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
    var isNewLine = function(char) {
        return char === _char.N;
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
    var onSkip = function() {
        col++;
    };
    var unq = function(val) {
        return (0, _utils).unquote((0, _utils).trimChar(val, _char.QUOTEMARK));
    };
    var chars = (0, _utils).createCharGrabber(buffer, {
        onSkip: onSkip
    });
    return {
        tokenize: tokenize,
        isTokenNested: isTokenNested
    };
}
var createTokenOfType = createToken;
exports.createTokenOfType = createTokenOfType;
exports.createLexer = createLexer;
