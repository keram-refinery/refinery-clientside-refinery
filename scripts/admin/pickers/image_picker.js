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
         * Initialize Images Dialog
         */
        init_dialog: function () {
            /**
             * refinery.admin.ImagesDialog
             */
            var dialog = refinery('admin.ImagesDialog').init();

            /**
             * Hide url tab as we can insert in picker only images from our library.
             * When it will be implemented functionality upload external image to server
             * then this can disappear
             *
             * @return {undefined}
             */
            dialog.on('load', function () {
                dialog.holder.find('a[href="#external-image-area"]').parent().hide();
            });

            this.dialog = dialog;
        },

        /**
         * Attach image to form
         *
         * @param {images_dialog_object} img
         *
         * @return {Object} self
         */
        insert: function (img) {
            this.elm_current_record_id.val(img.id);

            this.elm_record_holder.html($('<img/>', {
                'class': 'record size-medium',
                'src': img.thumbnail
            }));

            this.elm_no_picked_record.addClass('hide');
            this.elm_remove_picked_record.removeClass('hide');
            this.dialog.close();
            this.trigger('insert');

            return this;
        }
    });

}(refinery));
