"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.TagNode = void 0;
var _char = require("./char");
var _index = require("./index");
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
    var uniqAattr = (0, _index).getUniqAttr(params);
    if (uniqAattr) {
        var tagAttr = (0, _index).attrValue(tag, uniqAattr);
        var attrs = _objectSpread({
        }, params);
        delete attrs[uniqAattr];
        var attrsStr = (0, _index).attrsToString(attrs);
        return "".concat(tagAttr).concat(attrsStr);
    }
    return "".concat(tag).concat((0, _index).attrsToString(params));
};
var TagNode = /*#__PURE__*/ function() {
    "use strict";
    function TagNode(tag, attrs, content) {
        _classCallCheck(this, TagNode);
        this.tag = tag;
        this.attrs = attrs;
        this.content = Array.isArray(content) ? content : [
            content
        ];
    }
    _createClass(TagNode, [
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
                return (0, _index).appendToNode(this, value);
            }
        },
        {
            key: "length",
            get: function get() {
                return (0, _index).getNodeLength(this);
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
exports.TagNode = TagNode;
var _default = TagNode;
exports.default = _default;
