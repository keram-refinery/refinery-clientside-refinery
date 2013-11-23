
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
            var paths = document.location.pathname.split('/').filter(function (e) {
                return e !== '';
            });

            if (/^[a-z]{2}(-[a-zA-Z]{2,3})?$/.test(paths[0])) {
                return '/' + paths[0] + '/' + paths[1];
            } else {
                return '/' + paths[0];
            }
        }
    };

}(refinery));
