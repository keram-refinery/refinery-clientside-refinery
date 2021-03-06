/*jslint sub: true, plusplus: true */
/*jshint sub: true, unused: false */
/*global $, refinery */

(function (refinery) {

    'use strict';

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
