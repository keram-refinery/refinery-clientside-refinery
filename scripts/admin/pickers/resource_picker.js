/*global $, refinery */

(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Picker}
     * @param {Object=} options
     */
    refinery.Object.create({
        objectPrototype: refinery('admin.Picker', null, true),

        name: 'ResourcePicker',

        /**
         * Attach resource to form
         *
         * @param {{id: string, url: string, html: string}} resource
         *
         * @return {Object} self
         */
        insert: function (resource) {
            if (resource) {
                this.elm_current_record_id.val(resource.id);

                this.elm_record_holder.html($('<a/>', {
                    src: resource.url,
                    html: resource.html
                }));

                this.elm_no_picked_record.addClass('hide');
                this.elm_remove_picked_record.removeClass('hide');
                this.dialog.close();
                this.trigger('insert');
            }

            return this;
        }

    });

}(refinery));
