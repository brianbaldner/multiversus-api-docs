(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.BbobParser = {}));
})(this, (function (exports) { 'use strict';

    var TagNode$1 = {};

    var char = {};

    Object.defineProperty(char, "__esModule", {
        value: true
    });
    var BACKSLASH_1 = char.BACKSLASH = char.PLACEHOLDER_SPACE = char.PLACEHOLDER_SPACE_TAB = SLASH_1 = char.SLASH = CLOSE_BRAKET_1 = char.CLOSE_BRAKET = OPEN_BRAKET_1 = char.OPEN_BRAKET = SPACE_1 = char.SPACE = QUOTEMARK_1 = char.QUOTEMARK = EQ_1 = char.EQ = TAB_1 = char.TAB = char.R = char.F = N_1 = char.N = void 0;
    var N = '\n';
    var TAB = '\t';
    var F = '\f';
    var R = '\r';
    var EQ = '=';
    var QUOTEMARK = '"';
    var SPACE = ' ';
    var OPEN_BRAKET = '[';
    var CLOSE_BRAKET = ']';
    var SLASH = '/';
    var BACKSLASH = '\\';
    var PLACEHOLDER_SPACE_TAB = '    ';
    var PLACEHOLDER_SPACE = ' ';
    var N_1 = char.N = N;
    char.F = F;
    char.R = R;
    var TAB_1 = char.TAB = TAB;
    var EQ_1 = char.EQ = EQ;
    var QUOTEMARK_1 = char.QUOTEMARK = QUOTEMARK;
    var SPACE_1 = char.SPACE = SPACE;
    var OPEN_BRAKET_1 = char.OPEN_BRAKET = OPEN_BRAKET;
    var CLOSE_BRAKET_1 = char.CLOSE_BRAKET = CLOSE_BRAKET;
    var SLASH_1 = char.SLASH = SLASH;
    char.PLACEHOLDER_SPACE_TAB = PLACEHOLDER_SPACE_TAB;
    char.PLACEHOLDER_SPACE = PLACEHOLDER_SPACE;
    BACKSLASH_1 = char.BACKSLASH = BACKSLASH;

    var lib = {};

    Object.defineProperty(lib, "__esModule", {
        value: true
    });
    lib.isEOL = lib.isStringNode = isTagNode_1 = lib.isTagNode = lib.getUniqAttr = lib.getNodeLength = lib.escapeHTML = lib.appendToNode = lib.attrValue = lib.attrsToString = void 0;
    var _char$1 = char;
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
        return el === _char$1.N;
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
    lib.attrsToString = attrsToString;
    lib.attrValue = attrValue;
    lib.appendToNode = appendToNode;
    lib.escapeHTML = escapeHTML;
    lib.getNodeLength = getNodeLength;
    lib.getUniqAttr = getUniqAttr;
    var isTagNode_1 = lib.isTagNode = isTagNode;
    lib.isStringNode = isStringNode;
    lib.isEOL = isEOL;

    Object.defineProperty(TagNode$1, "__esModule", {
        value: true
    });
    var default_1 = TagNode$1.default = exports.TagNode = TagNode$1.TagNode = void 0;
    var _char = char;
    var _index = lib;
    function _classCallCheck$1(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function _defineProperties$1(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    function _createClass$1(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties$1(Constructor, staticProps);
        return Constructor;
    }
    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    function _objectSpread(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i] != null ? arguments[i] : {
            };
            var ownKeys = Object.keys(source);
            if (typeof Object.getOwnPropertySymbols === "function") {
                ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                }));
            }
            ownKeys.forEach(function(key) {
                _defineProperty(target, key, source[key]);
            });
        }
        return target;
    }
    var getTagAttrs = function(tag, params) {
        var uniqAattr = (_index).getUniqAttr(params);
        if (uniqAattr) {
            var tagAttr = (_index).attrValue(tag, uniqAattr);
            var attrs = _objectSpread({
            }, params);
            delete attrs[uniqAattr];
            var attrsStr = (_index).attrsToString(attrs);
            return "".concat(tagAttr).concat(attrsStr);
        }
        return "".concat(tag).concat((_index).attrsToString(params));
    };
    var TagNode = /*#__PURE__*/ function() {
        function TagNode(tag, attrs, content) {
            _classCallCheck$1(this, TagNode);
            this.tag = tag;
            this.attrs = attrs;
            this.content = Array.isArray(content) ? content : [
                content
            ];
        }
        _createClass$1(TagNode, [
            {
                key: "attr",
                value: function attr(name, value) {
                    if (typeof value !== 'undefined') {
                        this.attrs[name] = value;
                    }
                    return this.attrs[name];
                }
            },
            {
                key: "append",
                value: function append(value) {
                    return (_index).appendToNode(this, value);
                }
            },
            {
                key: "length",
                get: function get() {
                    return (_index).getNodeLength(this);
                }
            },
            {
                key: "toTagStart",
                value: function toTagStart(param) {
                    var ref = param === void 0 ? {
                    } : param, _openTag = ref.openTag, openTag = _openTag === void 0 ? _char.OPEN_BRAKET : _openTag, _closeTag = ref.closeTag, closeTag = _closeTag === void 0 ? _char.CLOSE_BRAKET : _closeTag;
                    var tagAttrs = getTagAttrs(this.tag, this.attrs);
                    return "".concat(openTag).concat(tagAttrs).concat(closeTag);
                }
            },
            {
                key: "toTagEnd",
                value: function toTagEnd(param) {
                    var ref = param === void 0 ? {
                    } : param, _openTag = ref.openTag, openTag = _openTag === void 0 ? _char.OPEN_BRAKET : _openTag, _closeTag = ref.closeTag, closeTag = _closeTag === void 0 ? _char.CLOSE_BRAKET : _closeTag;
                    return "".concat(openTag).concat(_char.SLASH).concat(this.tag).concat(closeTag);
                }
            },
            {
                key: "toTagNode",
                value: function toTagNode() {
                    return new TagNode(this.tag.toLowerCase(), this.attrs, this.content);
                }
            },
            {
                key: "toString",
                value: function toString(param) {
                    var ref = param === void 0 ? {
                    } : param, _openTag = ref.openTag, openTag = _openTag === void 0 ? _char.OPEN_BRAKET : _openTag, _closeTag = ref.closeTag, closeTag = _closeTag === void 0 ? _char.CLOSE_BRAKET : _closeTag;
                    var isEmpty = this.content.length === 0;
                    var content = this.content.reduce(function(r, node) {
                        return r + node.toString({
                            openTag: openTag,
                            closeTag: closeTag
                        });
                    }, '');
                    var tagStart = this.toTagStart({
                        openTag: openTag,
                        closeTag: closeTag
                    });
                    if (isEmpty) {
                        return tagStart;
                    }
                    return "".concat(tagStart).concat(content).concat(this.toTagEnd({
                        openTag: openTag,
                        closeTag: closeTag
                    }));
                }
            }
        ]);
        return TagNode;
    }();
    TagNode.create = function(tag, param, param1) {
        var attrs = param === void 0 ? {
        } : param, content = param1 === void 0 ? [] : param1;
        return new TagNode(tag, attrs, content);
    };
    TagNode.isOf = function(node, type) {
        return node.tag === type;
    };
    exports.TagNode = TagNode$1.TagNode = TagNode;
    var _default = TagNode;
    default_1 = TagNode$1.default = _default;

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
        return getTokenValue(token).charCodeAt(0) === SLASH_1.charCodeAt(0);
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
        var text = OPEN_BRAKET_1;
        text += getTokenValue(token);
        text += CLOSE_BRAKET_1;
        return text;
    };
    var Token = /*#__PURE__*/ function() {
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
    var TYPE_WORD = TOKEN_TYPE_WORD;
    var TYPE_TAG = TOKEN_TYPE_TAG;
    var TYPE_ATTR_NAME = TOKEN_TYPE_ATTR_NAME;
    var TYPE_ATTR_VALUE = TOKEN_TYPE_ATTR_VALUE;
    var TYPE_SPACE = TOKEN_TYPE_SPACE;
    var TYPE_NEW_LINE = TOKEN_TYPE_NEW_LINE;

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
    /**
     * Creates a grabber wrapper for source string, that helps to iterate over string char by char
     * @param {String} source
     * @param {Object} options
     * @param {Function} options.onSkip
     * @return CharGrabber
     */ var createCharGrabber = function(source, options) {
        return new CharGrabber(source, options);
    };
    /**
     * Trims string from start and end by char
     * @example
     *  trimChar('*hello*', '*') ==> 'hello'
     * @param {String} str
     * @param {String} charToRemove
     * @returns {String}
     */ var trimChar = function(str, charToRemove) {
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
    /**
     * Unquotes \" to "
     * @param str
     * @return {String}
     */ var unquote = function(str) {
        return str.replace(BACKSLASH_1 + QUOTEMARK_1, QUOTEMARK_1);
    };
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
    /**
     *
     * @param values
     * @return {NodeList}
     */ var createList = function(param) {
        var values = param === void 0 ? [] : param;
        return new NodeList(values);
    };

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
        return new Token(type, value, r, cl);
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
                    return !(char === EQ_1 || isWhiteSpace(char));
                };
                var name = tagChars.grabWhile(validAttrName);
                var isEnd = tagChars.isLast();
                var isValue = tagChars.getCurr() !== EQ_1;
                tagChars.skip();
                if (isEnd || isValue) {
                    emitToken(TYPE_ATTR_VALUE, unq(name));
                } else {
                    emitToken(TYPE_ATTR_NAME, name);
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
                    var isQM = char === QUOTEMARK_1;
                    var prevChar = tagChars.getPrev();
                    var nextChar = tagChars.getNext();
                    var isPrevSLASH = prevChar === BACKSLASH_1;
                    var isNextEQ = nextChar === EQ_1;
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
                emitToken(TYPE_ATTR_VALUE, unq(name));
                if (tagChars.isLast()) {
                    return TAG_STATE_NAME;
                }
                return TAG_STATE_ATTR;
            }
            var validName = function(char) {
                return !(char === EQ_1 || isWhiteSpace(char) || tagChars.isLast());
            };
            var name = tagChars.grabWhile(validName);
            emitToken(TYPE_TAG, name);
            tagChars.skip();
            // in cases when we has [url=someval]GET[/url] and we dont need to parse all
            if (isSingleValueTag) {
                return TAG_STATE_VALUE;
            }
            var hasEQ = tagChars.includes(EQ_1);
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
                    emitToken(TYPE_WORD, currChar);
                    return STATE_WORD;
                }
                // [myTag   ]
                var isNoAttrsInTag = substr.indexOf(EQ_1) === -1;
                // [/myTag]
                var isClosingTag = substr[0] === SLASH_1;
                if (isNoAttrsInTag || isClosingTag) {
                    var name = chars.grabWhile(function(char) {
                        return char !== closeTag;
                    });
                    chars.skip(); // skip closeTag
                    emitToken(TYPE_TAG, name);
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
            var tagGrabber = createCharGrabber(tagStr, {
                onSkip: onSkip
            });
            var hasSpace = tagGrabber.includes(SPACE_1);
            tagMode = TAG_STATE_NAME;
            while(tagGrabber.hasNext()){
                tagMode = nextTagState(tagGrabber, !hasSpace);
            }
            chars.skip(); // skip closeTag
            return STATE_WORD;
        };
        var stateWord = function stateWord() {
            if (isNewLine(chars.getCurr())) {
                emitToken(TYPE_NEW_LINE, chars.getCurr());
                chars.skip();
                col = 0;
                row++;
                return STATE_WORD;
            }
            if (isWhiteSpace(chars.getCurr())) {
                emitToken(TYPE_SPACE, chars.grabWhile(isWhiteSpace));
                return STATE_WORD;
            }
            if (chars.getCurr() === openTag) {
                if (chars.includes(closeTag)) {
                    return STATE_TAG;
                }
                emitToken(TYPE_WORD, chars.getCurr());
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
                        emitToken(TYPE_WORD, nextChar);
                        return STATE_WORD;
                    }
                    emitToken(TYPE_WORD, currChar);
                    return STATE_WORD;
                }
                var isChar = function(char) {
                    return isCharToken(char) && !isEscapeChar(char);
                };
                emitToken(TYPE_WORD, chars.grabWhile(isChar));
                return STATE_WORD;
            }
            emitToken(TYPE_WORD, chars.grabWhile(isCharToken));
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
            var value = openTag + SLASH_1 + token.getValue();
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
        var openTag = options.openTag || OPEN_BRAKET_1;
        var closeTag = options.closeTag || CLOSE_BRAKET_1;
        var escapeTags = !!options.enableEscapeTags;
        var onToken = options.onToken || function() {
        };
        var RESERVED_CHARS = [
            closeTag,
            openTag,
            QUOTEMARK_1,
            BACKSLASH_1,
            SPACE_1,
            TAB_1,
            EQ_1,
            N_1,
            EM
        ];
        var NOT_CHAR_TOKENS = [
            // ...(options.enableEscapeTags ? [BACKSLASH] : []),
            openTag,
            SPACE_1,
            TAB_1,
            N_1, 
        ];
        var WHITESPACES = [
            SPACE_1,
            TAB_1
        ];
        var SPECIAL_CHARS = [
            EQ_1,
            SPACE_1,
            TAB_1
        ];
        var isCharReserved = function(char) {
            return RESERVED_CHARS.indexOf(char) >= 0;
        };
        var isNewLine = function(char) {
            return char === N_1;
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
            return char === openTag || char === closeTag || char === BACKSLASH_1;
        };
        var isEscapeChar = function(char) {
            return char === BACKSLASH_1;
        };
        var onSkip = function() {
            col++;
        };
        var unq = function(val) {
            return unquote(trimChar(val, QUOTEMARK_1));
        };
        var chars = createCharGrabber(buffer, {
            onSkip: onSkip
        });
        return {
            tokenize: tokenize,
            isTokenNested: isTokenNested
        };
    }

    /**
     * @public
     * @param {String} input
     * @param {Object} opts
     * @param {Function} opts.createTokenizer
     * @param {Array<string>} opts.onlyAllowTags
     * @param {String} opts.openTag
     * @param {String} opts.closeTag
     * @param {Boolean} opts.enableEscapeTags
     * @return {Array}
     */ var parse = function(input, param) {
        var opts = param === void 0 ? {
        } : param;
        var options = opts;
        var openTag = options.openTag || OPEN_BRAKET_1;
        var closeTag = options.closeTag || CLOSE_BRAKET_1;
        var tokenizer = null;
        /**
       * Result AST of nodes
       * @private
       * @type {NodeList}
       */ var nodes = createList();
        /**
       * Temp buffer of nodes that's nested to another node
       * @private
       * @type {NodeList}
       */ var nestedNodes = createList();
        /**
       * Temp buffer of nodes [tag..]...[/tag]
       * @private
       * @type {NodeList}
       */ var tagNodes = createList();
        /**
       * Temp buffer of tag attributes
       * @private
       * @type {NodeList}
       */ var tagNodesAttrName = createList();
        /**
       * Cache for nested tags checks
       */ var nestedTagsMap = new Set();
        /**
       *
       * @param token
       * @returns {boolean}
       */ var isTokenNested = function(token) {
            var value = token.getValue();
            if (!nestedTagsMap.has(value) && tokenizer.isTokenNested && tokenizer.isTokenNested(token)) {
                nestedTagsMap.add(value);
                return true;
            }
            return nestedTagsMap.has(value);
        };
        /**
       * @param tagName
       * @returns {boolean}
       */ var isTagNested = function(tagName) {
            return Boolean(nestedTagsMap.has(tagName));
        };
        /**
       * @private
       * @param {String} value
       * @return {boolean}
       */ var isAllowedTag = function(value) {
            if (options.onlyAllowTags && options.onlyAllowTags.length) {
                return options.onlyAllowTags.indexOf(value) >= 0;
            }
            return true;
        };
        /**
       * Flushes temp tag nodes and its attributes buffers
       * @private
       * @return {Array}
       */ var flushTagNodes = function() {
            if (tagNodes.flushLast()) {
                tagNodesAttrName.flushLast();
            }
        };
        /**
       * @private
       * @return {Array}
       */ var getNodes = function() {
            var lastNestedNode = nestedNodes.getLast();
            if (lastNestedNode && Array.isArray(lastNestedNode.content)) {
                return lastNestedNode.content;
            }
            return nodes.toArray();
        };
        /**
       * @private
       * @param {string|TagNode} node
       */ var appendNodes = function(node) {
            var items = getNodes();
            if (Array.isArray(items)) {
                if (isTagNode_1(node)) {
                    if (isAllowedTag(node.tag)) {
                        items.push(node.toTagNode());
                    } else {
                        items.push(node.toTagStart({
                            openTag: openTag,
                            closeTag: closeTag
                        }));
                        if (node.content.length) {
                            node.content.forEach(function(item) {
                                items.push(item);
                            });
                            items.push(node.toTagEnd({
                                openTag: openTag,
                                closeTag: closeTag
                            }));
                        }
                    }
                } else {
                    items.push(node);
                }
            }
        };
        /**
       * @private
       * @param {Token} token
       */ var handleTagStart = function(token) {
            flushTagNodes();
            var tagNode = default_1.create(token.getValue());
            var isNested = isTokenNested(token);
            tagNodes.push(tagNode);
            if (isNested) {
                nestedNodes.push(tagNode);
            } else {
                appendNodes(tagNode);
            }
        };
        /**
       * @private
       * @param {Token} token
       */ var handleTagEnd = function(token) {
            flushTagNodes();
            var lastNestedNode = nestedNodes.flushLast();
            if (lastNestedNode) {
                appendNodes(lastNestedNode);
            } else if (typeof options.onError === 'function') {
                var tag = token.getValue();
                var line = token.getLine();
                var column = token.getColumn();
                options.onError({
                    message: "Inconsistent tag '".concat(tag, "' on line ").concat(line, " and column ").concat(column),
                    tagName: tag,
                    lineNumber: line,
                    columnNumber: column
                });
            }
        };
        /**
       * @private
       * @param {Token} token
       */ var handleTag = function(token) {
            // [tag]
            if (token.isStart()) {
                handleTagStart(token);
            }
            // [/tag]
            if (token.isEnd()) {
                handleTagEnd(token);
            }
        };
        /**
       * @private
       * @param {Token} token
       */ var handleNode = function(token) {
            /**
         * @type {TagNode}
         */ var lastTagNode = tagNodes.getLast();
            var tokenValue = token.getValue();
            var isNested = isTagNested(token);
            if (lastTagNode) {
                if (token.isAttrName()) {
                    tagNodesAttrName.push(tokenValue);
                    lastTagNode.attr(tagNodesAttrName.getLast(), '');
                } else if (token.isAttrValue()) {
                    var attrName = tagNodesAttrName.getLast();
                    if (attrName) {
                        lastTagNode.attr(attrName, tokenValue);
                        tagNodesAttrName.flushLast();
                    } else {
                        lastTagNode.attr(tokenValue, tokenValue);
                    }
                } else if (token.isText()) {
                    if (isNested) {
                        lastTagNode.append(tokenValue);
                    } else {
                        appendNodes(tokenValue);
                    }
                } else if (token.isTag()) {
                    // if tag is not allowed, just past it as is
                    appendNodes(token.toString());
                }
            } else if (token.isText()) {
                appendNodes(tokenValue);
            } else if (token.isTag()) {
                // if tag is not allowed, just past it as is
                appendNodes(token.toString());
            }
        };
        /**
       * @private
       * @param {Token} token
       */ var onToken = function(token) {
            if (token.isTag()) {
                handleTag(token);
            } else {
                handleNode(token);
            }
        };
        tokenizer = (opts.createTokenizer ? opts.createTokenizer : createLexer)(input, {
            onToken: onToken,
            onlyAllowTags: options.onlyAllowTags,
            openTag: openTag,
            closeTag: closeTag,
            enableEscapeTags: options.enableEscapeTags
        });
        // eslint-disable-next-line no-unused-vars
        tokenizer.tokenize();
        return nodes.toArray();
    };

    exports["default"] = parse;
    exports.parse = parse;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
