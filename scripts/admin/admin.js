
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
         * But also: '/en/refinery', '/pt-BR/refinery'
         *
         * @expose
         * @return {string}
         */
        backend_path: function () {
            return /** @type {string} */($('body').data('backend_path'));
        }
    };

}(refinery));
