"use strict";

exports.__esModule = true;
exports.createLexer = createLexer;
exports.createTokenOfType = void 0;

var _char14 = require("@bbob/plugin-helper/lib/char");

var _Token = require("./Token");

var _utils = require("./utils");

/* eslint-disable no-plusplus,no-param-reassign */
// for cases <!-- -->
var EM = '!';
/**
 * Creates a Token entity class
 * @param {Number} type
 * @param {String} value
 * @param {Number} r line number
 * @param {Number} cl char number in line
 */

var createToken = function createToken(type, value, r, cl) {
  if (r === void 0) {
    r = 0;
  }

  if (cl === void 0) {
    cl = 0;
  }

  return new _Token.Token(type, value, r, cl);
};
/**
 * @typedef {Object} Lexer
 * @property {Function} tokenize
 * @property {Function} isTokenNested
 */

/**
 * @param {String} buffer
 * @param {Object} options
 * @param {Function} options.onToken
 * @param {String} options.openTag
 * @param {String} options.closeTag
 * @param {Boolean} options.enableEscapeTags
 * @return {Lexer}
 */


function createLexer(buffer, options) {
  if (options === void 0) {
    options = {};
  }

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
  var openTag = options.openTag || _char14.OPEN_BRAKET;
  var closeTag = options.closeTag || _char14.CLOSE_BRAKET;
  var escapeTags = !!options.enableEscapeTags;

  var onToken = options.onToken || function () {};

  var RESERVED_CHARS = [closeTag, openTag, _char14.QUOTEMARK, _char14.BACKSLASH, _char14.SPACE, _char14.TAB, _char14.EQ, _char14.N, EM];
  var NOT_CHAR_TOKENS = [// ...(options.enableEscapeTags ? [BACKSLASH] : []),
  openTag, _char14.SPACE, _char14.TAB, _char14.N];
  var WHITESPACES = [_char14.SPACE, _char14.TAB];
  var SPECIAL_CHARS = [_char14.EQ, _char14.SPACE, _char14.TAB];

  var isCharReserved = function isCharReserved(_char) {
    return RESERVED_CHARS.indexOf(_char) >= 0;
  };

  var isNewLine = function isNewLine(_char2) {
    return _char2 === _char14.N;
  };

  var isWhiteSpace = function isWhiteSpace(_char3) {
    return WHITESPACES.indexOf(_char3) >= 0;
  };

  var isCharToken = function isCharToken(_char4) {
    return NOT_CHAR_TOKENS.indexOf(_char4) === -1;
  };

  var isSpecialChar = function isSpecialChar(_char5) {
    return SPECIAL_CHARS.indexOf(_char5) >= 0;
  };

  var isEscapableChar = function isEscapableChar(_char6) {
    return _char6 === openTag || _char6 === closeTag || _char6 === _char14.BACKSLASH;
  };

  var isEscapeChar = function isEscapeChar(_char7) {
    return _char7 === _char14.BACKSLASH;
  };

  var onSkip = function onSkip() {
    col++;
  };

  var unq = function unq(val) {
    return (0, _utils.unquote)((0, _utils.trimChar)(val, _char14.QUOTEMARK));
  };

  var chars = (0, _utils.createCharGrabber)(buffer, {
    onSkip: onSkip
  });
  /**
   * Emits newly created token to subscriber
   * @param {Number} type
   * @param {String} value
   */

  function emitToken(type, value) {
    var token = createToken(type, value, row, col);
    onToken(token);
    tokenIndex += 1;
    tokens[tokenIndex] = token;
  }

  function nextTagState(tagChars, isSingleValueTag) {
    if (tagMode === TAG_STATE_NAME) {
      var currChar = tagChars.getCurr();
      var hasNext = tagChars.hasNext();
      var isWS = isWhiteSpace(currChar);
      var isQM = currChar === _char14.QUOTEMARK;

      if (isWS || isQM || !hasNext) {
        return TAG_STATE_VALUE;
      }

      var validName = function validName(_char8) {
        return !(_char8 === _char14.EQ || isWhiteSpace(_char8) || tagChars.isLast());
      };

      var name = tagChars.grabWhile(validName);
      emitToken(_Token.TYPE_TAG, name);
      tagChars.skip(); // in cases when we has [url=someval]GET[/url] and we dont need to parse all

      if (isSingleValueTag) {
        return TAG_STATE_VALUE;
      }

      var hasEQ = tagChars.includes(_char14.EQ);
      return hasEQ ? TAG_STATE_ATTR : TAG_STATE_VALUE;
    }

    if (tagMode === TAG_STATE_ATTR) {
      var validAttrName = function validAttrName(_char9) {
        return !(_char9 === _char14.EQ || isWhiteSpace(_char9));
      };

      var _name = tagChars.grabWhile(validAttrName);

      var isEnd = tagChars.isLast();

      var isValue = tagChars.getCurr() !== _char14.EQ;

      tagChars.skip();

      if (isEnd || isValue) {
        emitToken(_Token.TYPE_ATTR_VALUE, unq(_name));
      } else {
        emitToken(_Token.TYPE_ATTR_NAME, _name);
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

      var validAttrValue = function validAttrValue(_char10) {
        // const isEQ = char === EQ;
        var isQM = _char10 === _char14.QUOTEMARK;
        var prevChar = tagChars.getPrev();
        var nextChar = tagChars.getNext();
        var isPrevSLASH = prevChar === _char14.BACKSLASH;
        var isNextEQ = nextChar === _char14.EQ;
        var isWS = isWhiteSpace(_char10); // const isPrevWS = isWhiteSpace(prevChar);

        var isNextWS = isWhiteSpace(nextChar);

        if (stateSpecial && isSpecialChar(_char10)) {
          return true;
        }

        if (isQM && !isPrevSLASH) {
          stateSpecial = !stateSpecial;

          if (!stateSpecial && !(isNextEQ || isNextWS)) {
            return false;
          }
        }

        if (!isSingleValueTag) {
          return isWS === false; // return (isEQ || isWS) === false;
        }

        return true;
      };

      var _name2 = tagChars.grabWhile(validAttrValue);

      tagChars.skip();
      emitToken(_Token.TYPE_ATTR_VALUE, unq(_name2));

      if (tagChars.isLast()) {
        return TAG_STATE_NAME;
      }

      return TAG_STATE_ATTR;
    }

    return TAG_STATE_NAME;
  }

  function stateTag() {
    var currChar = chars.getCurr();

    if (currChar === openTag) {
      var nextChar = chars.getNext();
      chars.skip(); // detect case where we have '[My word [tag][/tag]' or we have '[My last line word'

      var substr = chars.substrUntilChar(closeTag);
      var hasInvalidChars = substr.length === 0 || substr.indexOf(openTag) >= 0;

      if (isCharReserved(nextChar) || hasInvalidChars || chars.isLast()) {
        emitToken(_Token.TYPE_WORD, currChar);
        return STATE_WORD;
      } // [myTag   ]


      var isNoAttrsInTag = substr.indexOf(_char14.EQ) === -1; // [/myTag]

      var isClosingTag = substr[0] === _char14.SLASH;

      if (isNoAttrsInTag || isClosingTag) {
        var name = chars.grabWhile(function (_char11) {
          return _char11 !== closeTag;
        });
        chars.skip(); // skip closeTag

        emitToken(_Token.TYPE_TAG, name);
        return STATE_WORD;
      }

      return STATE_TAG_ATTRS;
    }

    if (currChar === closeTag) {
      chars.skip();
      emitToken(_Token.TYPE_WORD, currChar);
      return STATE_WORD;
    }

    return STATE_WORD;
  }

  function stateAttrs() {
    var silent = true;
    var tagStr = chars.grabWhile(function (_char12) {
      return _char12 !== closeTag;
    }, silent);
    var tagGrabber = (0, _utils.createCharGrabber)(tagStr, {
      onSkip: onSkip
    });
    var hasSpace = tagGrabber.includes(_char14.SPACE);

    while (tagGrabber.hasNext()) {
      tagMode = nextTagState(tagGrabber, !hasSpace);
    }

    chars.skip(); // skip closeTag

    return STATE_WORD;
  }

  function stateWord() {
    if (isNewLine(chars.getCurr())) {
      emitToken(_Token.TYPE_NEW_LINE, chars.getCurr());
      chars.skip();
      col = 0;
      row++;
      return STATE_WORD;
    }

    if (isWhiteSpace(chars.getCurr())) {
      emitToken(_Token.TYPE_SPACE, chars.grabWhile(isWhiteSpace));
      return STATE_WORD;
    }

    if (chars.getCurr() === openTag) {
      if (chars.includes(closeTag)) {
        return STATE_TAG;
      }

      emitToken(_Token.TYPE_WORD, chars.getCurr());
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

          emitToken(_Token.TYPE_WORD, nextChar);
          return STATE_WORD;
        }

        emitToken(_Token.TYPE_WORD, currChar);
        return STATE_WORD;
      }

      var isChar = function isChar(_char13) {
        return isCharToken(_char13) && !isEscapeChar(_char13);
      };

      emitToken(_Token.TYPE_WORD, chars.grabWhile(isChar));
      return STATE_WORD;
    }

    emitToken(_Token.TYPE_WORD, chars.grabWhile(isCharToken));
    return STATE_WORD;
  }

  function tokenize() {
    while (chars.hasNext()) {
      switch (stateMode) {
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
  }

  function isTokenNested(token) {
    var value = openTag + _char14.SLASH + token.getValue(); // potential bottleneck

    return buffer.indexOf(value) > -1;
  }

  return {
    tokenize: tokenize,
    isTokenNested: isTokenNested
  };
}

var createTokenOfType = createToken;
exports.createTokenOfType = createTokenOfType;