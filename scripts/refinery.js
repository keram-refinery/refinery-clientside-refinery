/*jslint sub: true, plusplus: true */
/*global window, document, $ */

'use strict';

/**
 * Main Refinery Object and namespace
 *
 * @type {Object}
 */
var refinery = {

    /**
     * Object name
     *
     * @expose
     *
     * @type {string}
     */
    name: 'refinery',

    /**
     * Get new object instance
     *
     * @expose
     *
     * @param {string} path
     * @param {*=} options
     * @param {boolean=} is_prototype
     *
     * @return {Object}
     */
    n: function (path, options, is_prototype) {
        var parents = path.split('.'),
            Parent = this;

        while (parents.length) {
            Parent = Parent[parents.shift()];
        }

        return new Parent(options, is_prototype);
    },

    /**
     * Extend Child Object with Parent properties
     *
     * @param {Object} Child
     * @param {Object} Parent
     *
     * @return {Object} Child
     */
    extend: function (Child, Parent) {
        var key;
        for (key in Parent) {
            if (Parent.hasOwnProperty(key) && !Child.hasOwnProperty(key)) {
                Child[key] = Parent[key];
            }
        }

        return Child;
    },

    /**
     * Include html flash message into flash container
     *
     * @expose
     *
     * @param {string} type
     * @param {string} message
     */
    flash: function (type, message) {
        var holder = $('#flash-container').empty(),
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
    },

    /**
     * Validator
     *
     * @expose
     * @type {Object}
     */
    validator: {

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
    },

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
    provide: function (path, opt_object, opt_objectToprovideTo) {
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
    },

    /**
     * see  https://github.com/cowboy/jquery-tiny-pubsub
     *
     * @type {Object}
     * @expose
     */
    pubsub: (function () {

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
    }()),

    /**
     * Wrapper around xhr calls with some basic response processing
     *
     * @expose
     * @type {Object}
     */
    xhr: {

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
            var i,
                holder = $('#flash-container').empty();

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
         * @param {{statusText: string, responseText: string}} xhr
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
         * @param {{html: Array, message: (Object|string|null)}} response
         * @param {string} status
         * @param {Object} xhr
         * @param {jQuery=} holder
         * @param {boolean=} replaceHolder
         *
         * @return {undefined}
         */
        success: function (response, status, xhr, holder, replaceHolder) {
            var redirected = xhr.getResponseHeader('X-XHR-Redirected-To');

            if (response.html) {
                refinery.xhr.processHtml(response.html, holder, replaceHolder);
            }

            if (response.message) {
                refinery.xhr.processMessage(response.message);
            }

            if (redirected) {
                window.history.pushState({
                    'refinery': true,
                    'url': redirected,
                    'prev_url': document.location.href
                }, '', redirected);
            }
        }
    },

    /**
     * Find partial, clean mess and update his content
     *
     * @param {string} id
     * @param {string} html
     *
     * @return {undefined}
     */
    updatePartial: function (id, html) {
        var partial = $('#' + id);

        partial.find('.refinery-instance').each(function () {
            refinery.Object.unbind($(this));
        });

        partial.html(html);
    },

    /**
     * Indicate running action
     *
     * @expose
     * @type {Object}
     */
    spinner: {

        /**
         * Show spinner
         *
         * @expose
         * @return {undefined}
         */
        on: function () {
            var body = $('body');
            body.addClass('loading');
            body.prop('aria-busy', true);
        },

        /**
         * Turn off spinner
         *
         * @expose
         * @return {undefined}
         */
        off: function () {
            var body = $('body');
            body.removeClass('loading');
            body.prop('aria-busy', false);
        }
    }
};

refinery.provide('refinery', refinery);