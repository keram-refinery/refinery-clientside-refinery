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
        objectPrototype: refinery('UserInterface', {
            'ui_modules': refinery.admin.ui
        }, true),

        module: 'admin',

        name: 'UserInterface'
    });

}(refinery));
