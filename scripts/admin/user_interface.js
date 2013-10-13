/*global refinery */

(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.UserInterface}
     * @param {Object=} options
     * @return {refinery.admin.UserInterface}
     */
    refinery.Object.create({

        objectPrototype: refinery('UserInterface', null, true),

        module: 'admin',

        name: 'UserInterface',

        /**
         * @expose
         * @type {Object}
         */
        ui: refinery.admin.ui
    });

}(refinery));
