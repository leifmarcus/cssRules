/**
*   Javascript CSS Rules
*   Author: Leif Marcus
*/
(function(name, definition) {
    if (typeof define === 'function') {
        // define for AMD:
        define(definition);
    } else if (typeof module !== 'undefined' && module.exports) {
        // exports for Node.js
        module.exports = definition();
    } else {
        // using the module in the browser:
        var curModule = definition(),
        global = this,
        originalModule = global[name];
        curModule.noConflict = function() {
            global[name] = originalModule;
            return curModule;
        };
        global[name] = curModule;
    }
} ('cssGenerator', function cssGenerator() {
    return function css() {
        // define style element:
        var definedRules = {};
        var container = document.getElementsByTagName('head')[0];
        var rootEl = document.createElement('style');
        // WebKit hack
        rootEl.appendChild(document.createTextNode(""));
        container.appendChild(rootEl);

        // style sheet object:
        var rootSheet = rootEl.sheet;
        return {
            /**
            *   splits a css string into a selector and properties and returns a style object
            *   @param {string} cssText - a string with css rules.
            *   @return {Object} - return the rule css object
            */
            getRuleAsObject: function getRuleAsObject(cssText) {
                var ruleList = cssText.split(';');
                var ruleObj = {};
                ruleList.forEach(function(rule, i) {
                    if (rule.indexOf(':') >= 0) {
                        var selectorAndCssText = rule.split(':');
                        ruleObj[selectorAndCssText[0]] = selectorAndCssText[1];
                    }
                });
                return ruleObj;
            },
            /**
            *   gets a rule by its selector as object
            *   @param {string} cssSelector - css selector of the current rule
            *   @return {Object} - return the rule css object
            */
            getRules: function getRules(cssSelector) {
                var cssRules = rootSheet.cssRules;
                var cssObj = {};
                for (var i = cssRules.length - 1; i >= 0; i--) {
                    if (cssRules[i].selectorText === cssSelector) {
                        var style = cssRules[i].style;
                        for (var n = 0, len = style.length; n < len; n++) {
                            cssObj[style.item(n)] = style.getPropertyValue(style.item(n));
                        }
                        break;
                    }
                }
                return cssObj;
            },
            /**
            *   set a css rule. this will overwrite existing
            *   rules
            *   @param {string} cssSelector - css selector of the current rule
            *   @param {string} cssRule - a css rule saved for the selector
            */
            setRule: function setRule(cssSelector, cssRule) {
                var index;
                if (definedRules[cssSelector]) {
                    index = definedRules[cssSelector].index;
                    var curRule = rootSheet.cssRules[index];
                    curRule.style.cssText = cssRule;
                } else {
                    index = this.addRule(cssSelector, cssRule);
                }
                // save styles to temp object:
                definedRules[cssSelector] = {
                    index: index,
                    rule: cssRule,
                    selector: cssSelector
                };
            },
            /**
            *   add a new css rule to the stylesheet.
            *   @param {string} cssSelector - css selector of the current rule
            *   @param {string} cssRule - a css rule saved for the selector
            *   @return {number} - the new index of the rule
            */
            addRule: function addRule(cssSelector, cssRule) {
                var rules = rootSheet.rules;
                var newIndex = rules.length;
                var cssText = cssSelector + '{' + cssRule + '}';
                return rootSheet.insertRule(cssText, newIndex);
            }
        };
    };
}));
