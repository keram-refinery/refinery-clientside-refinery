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

        name: 'ImagePicker',

        /**
         * Attach image to form
         *
         * @param {{id: string, size: string, medium: string}} img
         *
         * @return {Object} self
         */
        insert: function (img) {
            if (img) {
                this.elm_current_record_id.val(img.id);
                this.holder.find('.current-image-size').val(img.size);

                this.elm_record_holder.html($('<img/>', {
                    'class': 'size-medium',
                    'src': img.medium
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
