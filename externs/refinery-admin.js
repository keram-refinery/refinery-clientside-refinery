refinery.admin = {
  ui: {},

    /**
     * Backend path defined by Refinery::Core.backend_route
     * Default: '/refinery'
     *
     * @return {string}
     */
    backend_path: function () {}
};

/**
 * @constructor
 * @param {*=} options
 * @extends {refinery.Object}
 */
refinery.admin.Dialog = function (options) {};

refinery.admin.Dialog.prototype = {

    /**
     *
     * @expose
     *
     * @return {Object} self
     */
    close: function () {
    },

    /**
     *
     * @expose
     *
     * @return {Object} self
     */
    open: function () {
    },

    /**
     *
     * @expose
     *
     * @return {Object} self
     */
    submit: function () {
    },

    /**
     * Handle Insert event
     * For specific use should be implemented in subclasses
     *
     * @expose
     *
     * @return {Object} self
     */
    insert: function () {
    },

    /**
     * Load dialog content
     *
     * @expose
     * @todo this is (still) ugly, refactor!
     *
     * @return {Object} self
     */
    load: function () {
    },

   /**
    * Initialization and binding
    *
    * @public
    *
    * @return {refinery.admin.Dialog} self
    */
    init: function () {}
};


/**
 * @constructor
 * @extends {refinery.admin.Dialog}
 * @param {*=} options
 */
refinery.admin.ImagesDialog = function (options) {};

refinery.admin.ImagesDialog.prototype = {
    /**
     * Handle image linked from library
     *
     * @expose
     * @param {jQuery} tab
     * @return {undefined|{id: string}}
     */
    existing_image_area: function (tab) {
    },

    /**
     * Handle image linked by url
     *
     * @expose
     * @param {jQuery} tab
     * @return {undefined|{alt: string, url: string}}
     */
    external_image_area: function (tab) {
    },

    /**
     * Handle uploaded image
     *
     * @expose
     * @param {json_response} json_response
     * @return {undefined}
     */
    upload_area: function (json_response) { }
}


/**
 * @constructor
 * @extends {refinery.admin.Dialog}
 * @param {*=} options
 */
refinery.admin.ImageDialog = function (options) {};

refinery.admin.ImageDialog.prototype = { };


/**
 * @constructor
 * @extends {refinery.admin.Dialog}
 * @param {*=} options
 */
refinery.admin.ResourcesDialog = function (options) {};

refinery.admin.ResourcesDialog.prototype = {
    /**
     * Handle resource linked from library
     *
     * @expose
     * @param {!jQuery} li
     * @return {file_dialog_object}
     */
    existing_resource_area: function (li) {
    },

    /**
     * Handle uploaded file
     *
     * @param {json_response} json_response
     * @return {undefined}
     */
    upload_area: function (json_response) {
    }
};
