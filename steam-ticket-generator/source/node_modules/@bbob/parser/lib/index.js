"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _parse.default;
    }
});
Object.defineProperty(exports, "parse", {
    enumerable: true,
    get: function() {
        return _parse.parse;
    }
});
Object.defineProperty(exports, "TagNode", {
    enumerable: true,
    get: function() {
        return _tagNode.TagNode;
    }
});
var _parse = _interopRequireWildcard(require("./parse"));
var _tagNode = require("@bbob/plugin-helper/lib/TagNode");
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
