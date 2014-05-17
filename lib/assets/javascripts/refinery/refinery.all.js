
(function (window, $) {

// Source: scripts/refinery.js
(function () {

    /**
     * Detect if turbolinks library is present.
     * If not create object Turbolinks with public method visit,
     * to ensure that everything is working fine.
     *
     */
    if (typeof Turbolinks === 'undefined') {
        /**
         * Turbolinks
         * @expose
         * @type {Object}
         */
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
         *
         *
         * @expose
         * @param {Object|string} html
         * @param {jQuery} holder
         *
         * @return {undefined}
         */
        processHtml: function (html, holder) {
            for (var i = html.length - 1; i >= 0; i--) {
                if (typeof html[i] === 'string') {
                    holder.html(html[i]);
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

        redirected: function (xhr) {
            var redirected_to = xhr.getResponseHeader('X-XHR-Redirected-To');

            if (redirected_to) {
                window.history.pushState({
                    'refinery': true,
                    'url': redirected_to,
                    'prev_url': document.location.href
                }, '', redirected_to);
            }
        },

        processRedirect: function (to) {
            Turbolinks.visit(to);
        },

        /**
         *
         * @expose
         *
         * @param {json_response} response
         * @param {jQuery.jqXHR} xhr
         * @param {jQuery} holder
         *
         * @return {undefined}
         */
        success: function (response, xhr, holder) {
            var rxhr = refinery.xhr;

            if (response.redirect_to) {
                rxhr.processRedirect(response.redirect_to);
            }

            if (response.html) {
                rxhr.processHtml(response.html, holder);
            }

            if (response.message) {
                rxhr.processMessage(response.message);
            }

            rxhr.redirected(xhr);
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
     * Encode & > < " ' to html entities
     *
     * @return {string}
     */
    refinery.htmlEncode = (function () {
        var symbols = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#039;'
        };

        /**
         *
         * @param  {string} symbol
         * @return {string}
         */
        function substitute (symbol) {
            return symbols[symbol];
        }

        /**
         *
         * @param  {string} str
         * @return {string}
         */
        return function (str) {
            return str.replace(/[&<>\"\']/g, substitute);
        };
    }());

    /**
     * [ui description]
     *
     * @expose
     * @type {Object}
     */
    refinery.ui = {};

    refinery.provide('refinery', refinery);

}());

// Source: scripts/object_state.js
(function (refinery) {

    /**
     * refinery Object State
     *
     * @constructor
     * @expose
     * @param {Object=} default_states
     *    Usage:
     *        new refinery.ObjectState();
     *
     * @todo measure perf and if needed refactor, use bit masks, fsm or something else.
     *               Invent better solution because inheritance and modifications looks for me ugly ;/
     *               On other side "if(this.is('closable')).." is
     *               better than: "if (this.opened && !this.closing..) ..".
     */
    refinery.ObjectState = function (default_states) {
        default_states = default_states || {};
        this.states = $.extend(default_states, this.states);
    };

    /**
     * @typedef {refinery.ObjectState}
     */
    refinery.ObjectState.prototype = {
        /**
         * States holder
         *
         * @private
         * @type {?Object}
         */
        states: {},

        '_initialisable' : function () {
            return !(this.get('initialising') || this.get('initialised'));
        },

        /**
         * set state
         *
         * @param {string|Object} state
         * @param {boolean=} value
         *
         * @return {undefined}
         */
        set: function (state, value) {
            var key;
            if (typeof state === 'object') {
                for (key in state) {
                    if (state.hasOwnProperty(key)) {
                        this.states[key] = !!state[key];
                    }
                }
            } else {
                this.states[state] = (typeof value === 'undefined') ? true : !!value;
            }
        },

        /**
         * get state
         *
         * @expose
         * @param {string} state
         *
         * @return {boolean}
         */
        get: function (state) {
            return !!this.states[state];
        },

        /**
         * Work with object states
         *
         * @expose
         * @param {string} action
         *
         * @return {boolean}
         */
        is: function (action) {
            return !!(this.states[action] || (this['_' + action] && this['_' + action]()));
        }
    };

}(refinery));

// Source: scripts/object.js
(function (refinery) {

    /**
     * Refinery Object
     *
     * @constructor
     * @expose
     *
     * @param {Object=} options
     * @param {boolean=} is_prototype
     */
    refinery.Object = function (options, is_prototype) {
        this.id = refinery.Object.guid++;
        this.options = $.extend({}, this.options, options);
        this.events = {};

        /**
         * Unique Object Instance ID consist from his name and id
         *
         * @expose
         *
         * @type {string}
         */
        this.uid = this.name + this.id;

        // initialize state object only if
        // we are not using this object prototype
        if (!is_prototype) {
            this.state = new this.State();
        }
    };

    refinery.Object.prototype = {

        /**
         * Id
         *
         * @expose
         * @private
         * @type {number}
         */
        id: 0,

        /**
         * Name
         *
         * @expose
         * @type {string}
         */
        name: 'Object',

        /**
         * Version
         *
         * @expose
         * @type {string}
         */
        version: '0.1',

        /**
         * Module
         *
         * @expose
         * @type {string}
         */
        module: 'refinery',

        /**
         * Options
         *
         * @expose
         * @type {?Object}
         */
        options: null,

        /**
         * Events
         *
         * @expose
         * @type {?Object}
         */
        events: null,

        /**
         * jQuery wrapper around DOM element
         *
         * @expose
         * @type {?jQuery}
         */
        holder: null,

        /**
         * Fullname
         *
         * @expose
         * @public
         *
         * @type {string}
         */
        fullname: 'refinery.Object',

        /**
         * State class instatiable via Object constructor
         * @expose
         * @lends {refinery.ObjectState}
         */
        State: refinery.ObjectState,

        /**
         * State instance
         *
         * @expose
         *
         * @type {?refinery.ObjectState}
         */
        state: null,

        /**
         * Check or set object state
         *
         * @expose
         * @param {string|Object} action
         * @param {boolean=} state
         *
         * @return {boolean|undefined}
         */
        is: function (action, state) {
            if (!this.state) {
                return;
            }

            if (typeof state === 'undefined' && typeof action !== 'object') {
                return this.state.is(action);
            }

            this.state.set(action, state);
        },

        /**
         * Register Callback on event
         * If callback return false none of other callback after that
         * will be executed
         *
         * @public
         * @expose
         * @param {string} eventName
         * @param {Function} callback
         *
         * @return {refinery.Object} self
         */
        on: function (eventName, callback) {
            var events = this.events;

            events[eventName] = events[eventName] || [];
            events[eventName].push(callback);

            return this;
        },

        /**
         * Remove Callback from event
         *
         * @public
         * @expose
         * @param {string} eventName
         * @param {Function} callback
         *
         * @return {refinery.Object} self
         */
        off: function (eventName, callback) {
            var event_callbacks = this.events[eventName];

            if (event_callbacks) {
                event_callbacks.splice(event_callbacks.indexOf(callback), 1);
            }

            return this;
        },

        /**
         * Register observer on object event
         *
         * @expose
         * @public
         *
         * @param {string} eventName
         * @param {Function} callback
         *
         * @return {refinery.Object} self
         */
        subscribe: function (eventName, callback) {
            // console.log(eventName, this.uid, 'subscribed');
            refinery.pubsub.subscribe(this.uid + '.' + eventName, callback);

            return this;
        },

        /**
         * Remove observer from object event
         *
         * @expose
         * @public
         *
         * @param {string} eventName
         * @param {Function} callback
         *
         * @return {refinery.Object} self
         */
        unsubscribe: function (eventName, callback) {
            refinery.pubsub.unsubscribe(this.uid + '.' + eventName, callback);

            return this;
        },

        /**
         * Call registered callbacks and publish event for object observers
         *
         * @expose
         * @private
         *
         * @param {string} eventName
         * @param {Array=} args
         *
         * @return {refinery.Object}
         */
        trigger: function (eventName, args) {
            var callbacks = this.events[eventName],
                a, i;

            args = (typeof args !== 'undefined' && !(args instanceof Array)) ? [args] : args;

            if (callbacks) {
                for (a = callbacks, i = a.length - 1; i >= 0; i--) {
                    if (a[i].apply(this, args) === false) {
                        break;
                    }
                }
            }

            refinery.pubsub.publish(this.uid + '.' + eventName, args);

            return this;
        },

        /**
         * Null object: unbind holder, null state, null events
         * Events are nulled after broadcasting 'destroy' event, because if someone is
         * listening this event/object then he must get chance to respond.
         *
         * @expose
         * @return {Object} self
         */
        destroy: function () {
            if (this.holder) {
                this.holder.unbind();
            }

            this.state = null;

            this.trigger('destroy');
            this.events = {};

            return this;
        },

        /**
         * Call refinery Object destroy method on prototype.
         * This is required especialy when we rewrite destroy method on
         * inherited object from refinery.Object
         *
         * @expose
         * @return {Object} self
         */
        _destroy: function () {
            return refinery.Object.prototype.destroy.apply(this, arguments);
        },

        /**
         * Initialization and binding
         *
         * @public
         * @expose
         * @param {!jQuery} holder
         *
         * @return {refinery.Object} self
         */
        init: function (holder) {
            if (this.is('initialisable')) {
                this.holder = holder;
                this.is('initialised', true);
                this.trigger('init');
            }

            return this;
        }
    };

    /**
     * Incremental objects counter
     *
     * @type {number}
     */
    refinery.Object.guid = 1;

    /**
     * Refinery Object
     *
     * @expose
     *
     * @param {(Object|{objectPrototype: (Object|undefined),
     *                    objectConstructor: (undefined|function ((undefined|Object)): ?),
     *                    objectMethods: (Object|undefined),
     *                    name: (string|undefined),
     *                    version: (string|undefined),
     *                    module: (string|undefined),
     *                    options: (Object|undefined),
     *                    var_args})=} options
     *
     * @return {Object}
     */
    refinery.Object.create = function (options) {
        var MyObject,
            /** @type {string} */
            key,

            /**
             * Methods binded to object/class like Object.create
             * @type {Object}
             */
            object_methods,

            /**
             * Meta properties of created object
             * @type {Array}
             */
            intern_properties = ['objectPrototype', 'objectConstructor', 'objectMethods', 'id', 'uid'];

        options = options || {};
        object_methods = options['objectMethods'];

        /**
         * @constructor
         * @extends {refinery.Object}
         *
         * @param {Object=} options
         * @param {boolean=} is_prototype
         */
        MyObject = options['objectConstructor'] || function (options, is_prototype) {
            refinery.Object.call(this, options, is_prototype);
        };

        MyObject.prototype = options['objectPrototype'] || new refinery.Object(null, true);

        /** @expose */
        options.module = options.module ? 'refinery.' + options.module : MyObject.prototype.module;

        options.fullname = options.module + '.' + options.name;

        refinery.provide(options.fullname, MyObject);

        for (key in options) {
            if (options.hasOwnProperty(key) && intern_properties.indexOf(key) === -1) {
                MyObject.prototype[key] = options[key];
            }
        }

        if (object_methods) {
            for (key in object_methods) {
                if (object_methods.hasOwnProperty(key)) {
                    MyObject[key] = object_methods[key];
                }
            }
        }

        return MyObject;
    };

}(refinery));

// Source: scripts/user_interface.js
(function (refinery) {

    /**
     * @constructor
     * @extends {refinery.Object}
     * @param {Object=} options
     * @return {refinery.UserInterface}
     */
    refinery.Object.create(
        /**
         * @extends {refinery.Object.prototype}
         */
        {
            name: 'UserInterface',

            options: {

                /**
                 * @expose
                 * @type {Object}
                 */
                ui_modules: refinery.ui,

                /**
                 * When Ajax request receive partial without id,
                 * content of holder.find(main_content_selector) will be replaced.
                 *
                 * @expose
                 * @type {!string}
                 */
                main_content_selector: '#content'
            },

            /**
             * @expose
             * @param  {refinery.Object} object
             * @return {Object} self
             */
            addObject: function (object) {
                this.objects.push(object);

                return this;
            },

            /**
             * Register standard ui events on holder
             *     - flash message close button
             *     - ajax response processing
             *
             * @return {undefined}
             */
            bind_events: function () {
                var that = this,
                    rxhr = refinery.xhr,
                    holder = that.holder,
                    target = holder.find(that.options.main_content_selector);


                holder.on('click', '.flash-close',
                    /**
                     * @param  {jQuery.event} event
                     * @return {boolean} false
                     */
                    function (event) {
                        event.preventDefault();
                        $(this).parent().fadeOut();
                        return false;
                    });

                holder.on('ajax:success',
                    /**
                     * Process ajax response
                     *
                     * @param  {jQuery.event} event
                     * @param  {json_response} response
                     * @param  {string} status
                     * @param  {jQuery.jqXHR} xhr
                     * @return {undefined}
                     */
                    function (event, response, status, xhr) {
                        that.destroy();
                        rxhr.success(response, xhr, target);
                        that.trigger('ui:change');
                    });

                holder.on('ajax:error',
                    /**
                     * @param {jQuery.event} event
                     * @param {jQuery.jqXHR} xhr
                     * @param {string} status
                     * @return {undefined}
                     */
                    function (event, xhr, status) {
                        rxhr.error(xhr, status);
                    });

                holder.on('click', '.tree .toggle',
                    /**
                     * @param  {jQuery.event} event
                     * @return {undefined}
                     */
                    function (event) {
                        event.preventDefault();
                        that.toggle_tree_branch($(this).parents('li:first'));
                    });
            },

            toggle_tree_branch: function (li) {
                var elm = li.find('.toggle').first(),
                    nested = li.find('.nested').first();

                if (elm.hasClass('expanded')) {
                    elm.removeClass('expanded');
                    nested.slideUp();
                } else {

                    if (nested.hasClass('data-loaded')) {
                        elm.addClass('expanded');
                        nested.slideDown();
                    } else {
                        li.addClass('loading');
                        nested.load(nested.data('ajax-content'), function () {
                            elm.addClass('expanded');
                            nested.slideDown();
                            li.removeClass('loading');

                            if (nested.hasClass('data-cache')) {
                                nested.addClass('data-loaded');
                            }
                        });
                    }
                }
            },

            /**
             * Iterate through ui namespace and if found function,
             * call it with passed ui holder and self
             *
             * @expose
             * @return {undefined}
             */
            initialize_modules: function () {
                var holder = this.holder,
                    ui = this.options.ui_modules,
                    fnc;

                for (fnc in ui) {
                    if (ui.hasOwnProperty(fnc)) {
                        ui[fnc](holder, this);
                    }
                }
            },

            /**
             * @return {undefined}
             */
            init_jquery_ui_tabs: function () {
                this.holder.find('.ui-tabs').each(function () {
                    var elm = $(this),
                        nav = elm.find('> ul'),
                        nav_li = nav.find('li'),
                        index_stored = $.cookie('tab_' + elm.attr('id')),
                        index = nav.find('.ui-state-active').index();

                    if (index_stored && $(nav_li.get(index_stored)).is(':visible')) {
                        index = index_stored;
                    } else if (index === -1) {
                        index = nav.find('li:visible').first().index();
                    }

                    elm.tabs({
                        'active': index,
                        'activate': function (event, ui) {
                            $.cookie('tab_' + elm.attr('id'), ui.newTab.index() - 1, {'path': '/'});

                            ui.newPanel.find('input.text, textarea').first().focus();
                        }
                    });
                });
            },

            /**
             * @return {undefined}
             */
            init_jquery_ui_widgets: function () {
                var holder = this.holder;

                $.each(['selectable', 'sortable', 'accordion'], function (key, val) {
                    holder.find('.ui-' + val).each(function () {
                        var list = $(this);

                        list[val](list.data('ui-' + val + '-options'));
                    });
                });

                this.init_jquery_ui_tabs();
            },

            init_checkboxes: function () {
                this.holder.find('div.checkboxes').each(function () {
                    var holder = $(this),
                        chboxs = holder.find('input:checkbox').not('[readonly]');

                    if (chboxs.length > 1) {
                        holder.find('.checkboxes-cmd.' +
                                ((chboxs.length === chboxs.filter(':checked').length) ? 'none' : 'all')
                        ).removeClass('hide');
                    }
                });

                this.holder.on('click', '.checkboxes-cmd', function (e) {
                    e.preventDefault();
                    var a = $(this),
                        parent = a.parent(),
                        checkboxes = parent.find('input:checkbox').not('[readonly]'),
                        checked = a.hasClass('all');

                    checkboxes.prop('checked', checked);
                    parent.find('.checkboxes-cmd').toggleClass('hide');
                });
            },

            /**
             * @return {undefined}
             */
            init_toggle_hide: function () {
                this.holder.on('click', '.toggle-hide', function () {
                    var elm = $(this);
                    $(elm.attr('href').replace(/.+#/, '#')).toggleClass('js-hide');
                    elm.toggleClass('toggle-on');
                });
            },

            /**
             * Destroy self and also all refinery, jquery ui instances under holder
             *
             * @return {Object} self
             */
            destroy: function () {
                if (this.is('initialised')) {
                    try {
                        for (var i = this.objects.length - 1; i >= 0; i--) {
                            this.objects[i].destroy();
                        }
                    } catch (e) {
                        refinery.log(i, e, this.objects);
                    }
                }

                return this._destroy();
            },

            init: function (holder) {
                if (this.is('initialisable')) {
                    this.is('initialising', true);
                    this.holder = holder;
                    this.objects = [];
                    this.bind_events();
                    this.init_jquery_ui_widgets();
                    this.init_checkboxes();
                    this.init_toggle_hide();
                    this.initialize_modules();
                    this.is({'initialised': true, 'initialising': false});
                    this.trigger('init');
                }

                return this;
            }
        });

}(refinery));
}(window, jQuery));