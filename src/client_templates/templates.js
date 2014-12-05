(function() {
"use strict";
var declare = function() {
return (function() {
    var __ematches = {'&': '&amp;','<': '&lt;','>': '&gt;','"': '&quot;',"'": '&#x27;','/': '&#x2F;'};
    var escapeFunction = function(s) {return ('' + (!s ? '' : s))
        .replace(/[&<>"'/]/g, function(a){return __ematches[a];});};
    var exports = {};
    var sample = function(a) {
        var o = '';
        o += '\n';
        o += '<div><button>Click Me</button></div>\n';
        o += '<div class="js-result"></div>\n';
        return o;
    };
    exports.sample = sample;
    return exports;
})();
};
if (typeof(define) !== 'undefined') {
    define([], declare);
} else if (typeof(exports) !== 'undefined') {
    module.exports = declare();
} else {
    window.templates = declare();
}
})();