/*jslint sub: true, plusplus: true */
/*global $, refinery */

(function (refinery) {

    'use strict';

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
    refinery.Object.guid = 0;

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
