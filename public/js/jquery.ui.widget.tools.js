(function ($) {

    var W = jQuery.Widget;

    /**
     * Shortcut for $.proxy(func,this)
     * @param {Function} func
     * @return {Function}
     */
    W.prototype._proxy = function (func) {
        return $.proxy(func, this);
    };

    /**
     * Wrapper for console.log(widgetName, this, arguments...)
     * @return {jQuery.Widget}
     */
    W.prototype._log = function () {
        var args;
        if (typeof window.console !== 'undefined' && typeof console.log.apply !== 'undefined') {
            args = [this.widgetName + ':', this.element, this];
            args = args.concat(Array.prototype.slice.call(arguments, 0));
            console.log.apply(console, args);
        }
        return this;
    };

    /**
     * Wrapper for console.error(widgetName, this, arguments...)
     * @return {jQuery.Widget}
     */
    W.prototype._errorLog = function () {
        var args;
        if (typeof window.console !== 'undefined' && typeof console.log.error !== 'undefined') {
            args = [this.widgetName + ':', this.element, this];
            args = args.concat(Array.prototype.slice.call(arguments, 0));
            console.error.apply(console, args);
        }
        return this;
    };


    if (typeof W.prototype['_delay'] === 'undefined') {
        /**
         * Shortcut for setTimeout($.proxy(func,this), delay || 0)
         * @param {Function} func
         * @param {Integer} [delay]
         * @return {Number} timeoutId
         */
        W.prototype._delay = function (func, delay) {
            return setTimeout($.proxy(func, this), delay || 0);
        };
    }

    W.prototype._avoidEvent = function (eventName, eventCallback, avoidBlock, listenBlock) {
        var _this = this,
            eventData = {}, avoidEventData = {};

        listenBlock = listenBlock || this.element;
        eventData[eventName] = eventCallback;
        avoidEventData[eventName] = function () {
            stopEventListen();
            setTimeout(function () {
                startEventListen();
            }, 0);
        };

        function startEventListen() {
            _this._on(listenBlock, eventData);
        }

        function stopEventListen() {
            _this._off(listenBlock, eventName);
        }


        this._on(avoidBlock, avoidEventData);
        startEventListen();
    };

    /********************************************************/
    var buildElemClass = function (prefix, elemName) {
        return prefix + '__' + elemName;
    };

    var buildModClass = function (prefix, modName, modValue) {
        return prefix + '_' + modName + (modValue ? '_' + modValue : '');
    };

    var buildModElemClass = function (prefix, elemName, modName, modValue) {
        return buildModClass(buildElemClass(prefix, elemName), modName, modValue);
    };

    var BEM_NAME_REGEXP = '[a-z0-9\-]+';

    function getElemNameFromNode(blockName, ctx) {
        var classList,
            classIndex,
            searchData,
            searchRegExp;

        if (ctx['__bemMeta'] && ctx['__bemMeta']['block'] == blockName) {
            return ctx['__bemMeta']['elem'];
        }

        searchRegExp = new RegExp('^' + blockName + '__(' + BEM_NAME_REGEXP + ')$', 'i');
        classList = (ctx.attr('class') || '').split(' ');
        for (classIndex = 0; classIndex < classList.length; classIndex++) {
            searchData = $.trim(classList[classIndex]).match(searchRegExp);
            if (searchData) {
                return searchData[1];
            }
        }
        return false;
    }

    function getModList(ctx, prefix) {
        var mods = {},
            classList,
            classIndex,
            searchRegExp,
            searchData;

        searchRegExp = new RegExp('^' + prefix + '_(' + BEM_NAME_REGEXP + ')(?=_(' + BEM_NAME_REGEXP + ')$|$)', 'i');
        classList = (ctx.attr('class') || '').split(' ');
        for (classIndex = 0; classIndex < classList.length; classIndex += 1) {
            searchData = $.trim(classList[classIndex]).match(searchRegExp);
            if (searchData) {
                mods[searchData[1]] = searchData[2] || null;
            }
        }

        return mods;
    }

    /**
     * Find "element" of "block" in "context"
     * @param {string} elemName
     * @param {jQuery} [ctx]
     * @param {string} [modName]
     * @param {string} [modValue]
     * @return {jQuery}
     */
    W.prototype._elem = function (ctx, elemName, modName, modValue) {
        var searchClass, result;

        if (typeof ctx === 'string') {
            modValue = modName;
            modName = elemName;
            elemName = ctx;
            ctx = this.element;
        }

        searchClass = buildElemClass(this.widgetName, elemName);
        if (modName) {
            searchClass = buildModClass(searchClass, modName, modValue);
        }

        result = ctx.find('.' + searchClass);
        result['__bemMeta'] = {
            'elem':  elemName,
            'block': this.widgetName
        };

        return result;
    };

    /**
     * Get class for block element
     * @param {string} elemName
     * @return {string}
     */
    W.prototype._getElemClass = function (elemName) {
        return buildElemClass(this.widgetName, elemName);
    };

    /**
     * Get class for block modName with modValue
     * @param {string} modName
     * @param {string} [modValue]
     * @return {string}
     */
    W.prototype._getModClass = function (modName, modValue) {
        return buildModClass(this.widgetName, modName, modValue);
    };

    /**
     * Get class for block element modName with modValue
     * @param {string} elemName
     * @param {string} modName
     * @param {string} [modValue]
     * @return {string}
     */
    W.prototype._getModElemClass = function (elemName, modName, modValue) {
        return buildModElemClass(this.widgetName, elemName, modName, modValue);
    };

    /**
     * Set mod value class to block or element
     * @param {string} modName
     * @param {jQuery} [elem]
     * @param {string} [modValue=null]
     * @return {jQuery.Widget}
     */
    W.prototype._setMod = function (elem, modName, modValue) {
        var prefix, elemName;

        if (typeof elem === 'string') {
            modValue = modName;
            modName = elem;
            elem = this.element;
            prefix = this.widgetName;
            this._delMod(modName);
        } else {
            elemName = getElemNameFromNode(this.widgetName, elem);
            if (!elemName) {
                return this;
            }
            prefix = buildElemClass(this.widgetName, elemName);
            this._delMod(elem, modName);
        }

        if (!modValue) {
            modValue = null;
        }

        elem.addClass(buildModClass(prefix, modName, modValue));
        return this;
    };

    /**
     * Remove mod value class from block or element
     * @param {string} modName
     * @param {jQuery} [elem]
     * @return {jQuery.Widget}
     */
    W.prototype._delMod = function (elem, modName) {
        var prefix,
            elemName,
            mods,
            classToRemove;

        if (typeof elem === 'string') {
            modName = elem;
            elem = this.element;
            prefix = this.widgetName;
        } else {
            elemName = getElemNameFromNode(this.widgetName, elem);
            if (!elemName) {
                return this;
            }
            prefix = buildElemClass(this.widgetName, elemName);
        }

        mods = getModList(elem, prefix);
        classToRemove = buildModClass(prefix, modName, mods[modName]);
        elem.removeClass(classToRemove);

        return this;
    };

    /**
     * Check value mod class at block or element
     * @param {string} modName
     * @param {jQuery} [elem]
     * @param {string} [modValue=null]
     * @return {boolean}
     */
    W.prototype._hasMod = function (elem, modName, modValue) {
        var isBlock = false;

        if (typeof elem === 'string') {
            modValue = modName;
            modName = elem;
            elem = this.element;
            isBlock = true;
        }

        if (typeof modValue === 'undefined') {
            modValue = null;
        }

        return isBlock ? this._getMod(modName) === modValue : this._getMod(elem, modName) === modValue;
    };

    /**
     * Get mod value of block or element
     * @param {string}modName
     * @param {jQuery} [elem]
     * @return {string|null|undefined|false} if not such mod return undefined. if empty mod value return null. if can't find mod return false.
     */
    W.prototype._getMod = function (elem, modName) {
        var prefix, elemName;

        if (typeof elem === 'string') {
            modName = elem;
            elem = this.element;
            prefix = this.widgetName;
        } else {
            elemName = getElemNameFromNode(this.widgetName, elem);
            if (!elemName) {
                return false;
            }
            prefix = buildElemClass(this.widgetName, elemName);
        }

        return getModList(elem, prefix)[modName];
    };

})(jQuery);