/*jslint sub: true, plusplus: true */
/*global window, document, $ */

(function () {

    'use strict';

    /**
     * Detect if turbolinks library is present.
     * If not create object Turbolinks with public method visit,
     * to ensure that everything is working fine.
     *
     */
    if (typeof Turbolinks === 'undefined') {
        window.Turbolinks = {
            /**
             * Change document.location.href to passed url
             *
             * @param  {string} url
             * @return {undefined}
             */
            'visit': function (url) {
                document.location.href = url;
            }
        };
    }

    /**
     * @return {Object}
     */
    function refinery () {
        return refinery.newInstance.apply(refinery, arguments);
    }

    /**
     * Return instance of object defined by path (namespace)
     *
     * @param {string} path
     * @param {*=} options
     * @param {boolean=} is_prototype
     *
     * @return {Object}
     */
    refinery.newInstance = function (path, options, is_prototype) {
        var parents = path.split('.'),
            Parent = this;

        while (parents.length) {
            Parent = Parent[parents.shift()];
        }

        return new Parent(options, is_prototype);
    };

    /**
     * Extend Child Object with Parent properties
     *
     * @param {Object} Child
     * @param {Object} Parent
     *
     * @return {Object} Child
     */
    refinery.extend = function (Child, Parent) {
        var key;
        for (key in Parent) {
            if (Parent.hasOwnProperty(key) && !Child.hasOwnProperty(key)) {
                Child[key] = Parent[key];
            }
        }

        return Child;
    };

    /**
     * Include html flash message into flash container
     *
     * @expose
     *
     * @param {string} type
     * @param {string} message
     */
    refinery.flash = function (type, message) {
        var holder = $('#flash-wrapper').empty(),
            div = $('<div/>', {
                'class': 'flash flash-' + type,
                'html': message
            }).appendTo(holder);

        if (div.find('.flash-close').length === 0) {
            $('<a/>', {
                'class': 'flash-close',
                'text': 'close',
                'href': '#'
            }).appendTo(div);
        }
    };

    /**
     * Validator
     *
     * @expose
     * @type {Object}
     */
    refinery.validator = {

        /**
         * Email RegExp
         *
         * @expose
         *
         * @type {RegExp}
         */
        email: new RegExp(/^([a-z0-9_\.\-]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i),

        /**
         * Url RegExp
         *
         * @expose
         *
         * @type {RegExp}
         */
        url: new RegExp(/^(https?|ftp):\/\/([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?$/i),

        /**
         * Page RegExp
         *
         * @expose
         *
         * @type {RegExp}
         */
        page: new RegExp('^(https?:\/\/' + document.location.host + '|\/[a-z0-9]+)')
    };

    /**
     * Builds an object structure for the provided namespace path,
     * ensuring that names that already exist are not overwritten. For
     * example:
     * "a.b.c" -> a = {};a.b={};a.b.c={};
     *
     * @see goog.provide and goog.provideSymbol.
     * @expose
     * @param {string} path to the object that opt_object defines.
     * @param {*=} opt_object the object to expose at the end of the path.
     * @param {Object=} opt_objectToprovideTo The object to add the path to; default
     *     is |window|.
     */
    refinery.provide = function (path, opt_object, opt_objectToprovideTo) {
        var parts = path.split('.'), part = parts.shift(),
            cur = opt_objectToprovideTo || window;

        while (part) {
            if (!parts.length && opt_object !== 'undefined') {
                cur[part] = opt_object;
            } else if (cur[part]) {
                cur = cur[part];
            } else {
                cur = cur[part] = {};
            }
            part = parts.shift();
        }
    };

    /**
     * see  https://github.com/cowboy/jquery-tiny-pubsub
     *
     * @type {Object}
     * @expose
     */
    refinery.pubsub = (function () {

        /**
         * @private
         * @type {jQuery}
         */
        var o = $({});

        return {

            /**
             * Remove ALL subscribers/callbacks
             *
             * @expose
             * @return {undefined}
             */
            unbind: function () {
                o.unbind();
            },

            /**
             * Subscribe callback on Object event
             *
             * @expose
             * @param {string} eventName
             * @param {Function} callback
             *
             * @return {undefined}
             */
            subscribe: function (eventName, callback) {
                o.on(eventName, callback);
            },


            /**
             * Unsubscribe callback on Object event
             *
             * @expose
             * @param {string} eventName
             * @param {(function (jQuery.event=): ?|string|undefined)} callback
             *
             * @return {undefined}
             */
            unsubscribe: function (eventName, callback) {
                o.off(eventName, callback);
            },

            /**
             * Broadcast Object event to their observers with event datas
             *
             * @expose
             * @param {string} eventName
             * @param {*=} data
             *
             * @return {undefined}
             */
            publish: function (eventName, data) {
                o.trigger(eventName, data);
            }
        };
    }());

    /**
     * Wrapper around xhr calls with some basic response processing
     *
     * @expose
     * @type {Object}
     */
    refinery.xhr = {

        /**
         * Create and return jquery ajax object (promise) with default refinery
         * processing of request fail or success
         *
         * @expose
         * @param {string}   url
         * @param {(Object.<string,*>|function (string,string,jQuery.jqXHR))=} data
         * @param {jQuery=} holder
         *
         * @return {jQuery.jqXHR}
         */
        make: function (url, data, holder) {
            return $.ajax({
                url: url,
                data: data,
                dataType: 'JSON'
            })
            .fail(function (xhr, status) {
                refinery.xhr.error(xhr, status);
            })
            .done(function (response, status, xhr) {
                refinery.xhr.success(response, status, xhr, holder);
            });
        },

        /**
         * todo
         *
         * @expose
         * @param {Object|string} html
         * @param {jQuery=} holder
         * @param {boolean=} replaceHolder
         *
         * @return {undefined}
         */
        processHtml: function (html, holder, replaceHolder) {
            for (var i = html.length - 1; i >= 0; i--) {
                if (typeof html[i] === 'string' && holder.length > 0) {
                    if (replaceHolder) {
                        holder.replaceWith(html[i]);
                    } else {
                        holder.html(html[i]);
                    }
                } else {
                    for (var partial_id in html[i]) {
                        if (html[i].hasOwnProperty(partial_id)) {
                            refinery.updatePartial(partial_id, html[i][partial_id]);
                        }
                    }
                }
            }
        },

        /**
         * todo
         *
         * @expose
         * @param {Object|string} message
         *
         * @return {undefined}
         */
        processMessage: function (message) {
            var holder = $('#flash-wrapper').empty(),
                i;

            if (typeof message === 'object') {
                for (i in message) {
                    if (message.hasOwnProperty(i)) {
                        holder.append(message[i]);
                    }
                }
            } else {
                holder.append(message);
            }
        },

        /**
         * Process HTTP Errors on calls
         *
         * @expose
         * @param {jQuery.jqXHR} xhr
         * @param {string=} status
         *
         * @return {undefined}
         */
        error: function (xhr, status) {
            var flash = '<b class="' + status + '">' + xhr.statusText + '</b>',
                data;

            try {
                if (xhr.responseJSON) {
                    data = xhr.responseJSON;
                } else {
                    data = JSON.parse(xhr.responseText);
                }

                if (typeof data['error'] === 'string') {
                    flash += '! ' + data['error'];
                }
            } catch (e) { }

            refinery.flash('error', flash);
        },

        /**
         *
         * @param {json_response} response
         * @param {string} status
         * @param {jQuery.jqXHR} xhr
         * @param {jQuery=} holder
         * @param {boolean=} replaceHolder
         *
         * @return {undefined}
         */
        success: function (response, status, xhr, holder, replaceHolder) {
            var redirected_to = xhr.getResponseHeader('X-XHR-Redirected-To');

            if (response.html) {
                refinery.xhr.processHtml(response.html, holder, replaceHolder);
            }

            if (response.message) {
                refinery.xhr.processMessage(response.message);
            }

            if (redirected_to) {
                window.history.pushState({
                    'refinery': true,
                    'url': redirected_to,
                    'prev_url': document.location.href
                }, '', redirected_to);
            }
        }
    };

    /**
     * Find partial, clean mess and update his content
     *
     * @param {string} id
     * @param {string} html
     *
     * @return {undefined}
     */
    refinery.updatePartial = function (id, html) {
        var partial = $('#' + id);

        partial.html(html);
    };

    /**
     * Indicate running action
     *
     * @expose
     * @type {Object}
     */
    refinery.spinner = {

        /**
         * Show spinner
         *
         * @expose
         * @return {undefined}
         */
        on: function () {
            $('body')
            .addClass('loading')
            .prop('aria-busy', true);
        },

        /**
         * Turn off spinner
         *
         * @expose
         * @return {undefined}
         */
        off: function () {
            $('body')
            .removeClass('loading')
            .prop('aria-busy', false);
        }
    };

    /**
     * if browser doesn't support console.log log nothing
     *
     * @expose
     * @typedef {Function}
     */
    refinery.log = (typeof console === 'object' &&
                    typeof console.log === 'function') ? console.log : function () {};


    /**
     * [ui description]
     *
     * @expose
     * @type {Object}
     */
    refinery.ui = {};

    refinery.provide('refinery', refinery);

}());
