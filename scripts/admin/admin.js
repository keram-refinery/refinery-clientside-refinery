
(function (refinery) {

    'use strict';

    /**
     * Refinery Admin namespace
     *
     * @expose
     * @type {Object}
     */
    refinery.admin = {
        /**
         * Namespace for loading modules to ui
         *
         * @expose
         * @type {Object}
         */
        ui: {},

        /**
         * Backend path defined by Refinery::Core.backend_route
         * Default: '/refinery'
         *
         * @expose
         * @type {string}
         */
        backend_path: (function () {
            return '/' + document.location.pathname.split('/')[1];
        }())
    };

}(refinery));
