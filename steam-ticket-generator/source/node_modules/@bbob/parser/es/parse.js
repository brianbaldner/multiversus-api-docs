import TagNode from '@bbob/plugin-helper/lib/TagNode';
import { CLOSE_BRAKET, OPEN_BRAKET } from '@bbob/plugin-helper/lib/char';
import { isTagNode } from '@bbob/plugin-helper/lib/index';
import { createLexer } from './lexer';
import { createList } from './utils';
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
    var openTag = options.openTag || OPEN_BRAKET;
    var closeTag = options.closeTag || CLOSE_BRAKET;
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
            if (isTagNode(node)) {
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
        var tagNode = TagNode.create(token.getValue());
        var isNested = isTokenNested(token);
        tagNodes.push(tagNode);
        if (isNested) {
            nestedNodes.push(tagNode);
        } else {
            appendNodes(tagNode, token);
        }
    };
    /**
   * @private
   * @param {Token} token
   */ var handleTagEnd = function(token) {
        flushTagNodes();
        var lastNestedNode = nestedNodes.flushLast();
        if (lastNestedNode) {
            appendNodes(lastNestedNode, token);
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
    var tokens = tokenizer.tokenize();
    return nodes.toArray();
};
export { parse };
export default parse;
