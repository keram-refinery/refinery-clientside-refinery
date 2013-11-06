
/**
 * Refinery Object
 *
 * @constructor
 * @expose
 *
 * @param {Object=} options
 * @param {boolean=} is_prototype
 */
refinery.Object = function (options, is_prototype) { };

refinery.Object.objectMethods = {};
refinery.Object.objectPrototype = {};
refinery.Object.objectConstructor = function (options) {};
refinery.Object.State = function (options) {};

refinery.Object.prototype = {

    /**
     *
     * @private
     * @type {number}
     */
    id: 0,

    /**
     *
     * @type {string}
     */
    name: 'Object',

    /**
     *
     * @type {string}
     */
    version: '0.1',

    /**
     *
     * @type {string}
     */
    module: 'refinery',

    /**
     *
     * @type {Object|null}
     */
    options: null,

    /**
     *
     * @type {Object|null}
     */
    events: null,

    /**
     *
     * @type {Object|null}
     */
    holder: null,

    /**
     * State class instatiable via Object constructor
     *
     * @expose
     * @constructor
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
     * Default States
     *
     * @expose
     *
     * @type {?Object}
     */
    states: null,

    /**
     * Check or set object state
     *
     * @expose
     * @param {string} action
     * @param {boolean=} state
     *
     * @return {boolean}
     */
    is: function (action, state) {
    },

    /**
     * Register Callback on event
     * If callback return false none of other callback after that
     * will be executed
     *
     * @public
     * @param {string} eventName
     * @param {Function} callback
     *
     * @return {Object} this
     */
    on: function (eventName, callback) {
    },

    /**
     * Remove Callback from event
     *
     * @public
     * @param {string} eventName
     * @param {Function} callback
     *
     * @return {Object} this
     */
    off: function (eventName, callback) {
    },

    /**
     * Register observer on object event
     *
     * @public
     *
     * @param {string}         eventName
     * @param {Function=}  callback
     *
     * @return {Object}         self
     */
    subscribe: function (eventName, callback) {
    },

    /**
     * Remove observer from object event
     *
     * @public
     *
     * @param {string}         eventName
     * @param {Function=}  callback
     *
     * @return {Object}         self
     */
    unsubscribe: function (eventName, callback) {
    },

    /**
     * Call registered callbacks and publish event for object observers
     *
     * @private
     *
     * @param {string}      eventName
     * @param {Array=}    args
     *
     * @return {Object}
     */
    trigger: function (eventName, args) {
    },

    /**
     * Unique Object id consist from his name and id
     *
     * @expose
     *
     * @type {string}
     */
    uid: '',

    /**
     * Fullname
     *
     * @public
     *
     * @return {string}
     */
    fullname: '',

    /**
     * Deinitialization
     *
     * @public
     */
    destroy: function () { },

    /**
     * Call destroy method od prototype applied to this
     *
     * @public
     */
    _destroy: function () { },

    /**
     * Initialization and binding
     *
     * @public
     * @param {(jQuerySelector|jQuery|Element)} holder
     *
     * @return {Object} self
     */
    init: function (holder) { }
};

/**
 * Create refinery Object
 *
 * @param {(Object|{objectPrototype: (Object|undefined),
 *                    objectConstructor: (undefined|function((undefined|Object)): ?),
 *                    name: (string|undefined),
 *                    version: (string|undefined),
 *                    module: (string|undefined),
 *                    options: (Object|undefined),
 *                    var_args})=} options
 *
 * @return {Object}
 */
refinery.Object.create = function (options) { }

/**
 * @constructor
 * @param {Object=} default_states
 * @param {Object=} tests define tests for providing some action
 */
refinery.ObjectState = function (default_states, tests) {};

refinery.ObjectState.prototype = {
    states: {},

    /**
     * set state
     *
     * @param {string} state
     * @param {boolean=} value
     *
     * @return {undefined}
     */
    set: function (state, value) {
    },

    /**
     * get state
     *
     * @expose
     * @param {string} state
     *
     * @return {boolean}
     */
    get: function (state) {},

    /**
     * Work with object states
     *
     * @param {string} action
     *
     * @return {boolean}
     */
    is: function (action) {
    }
};
