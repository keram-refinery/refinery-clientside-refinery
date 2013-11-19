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
        bind_dialog: function (dialog) {
            var that = this;

            /**
             * refinery.admin.ImagesDialog
             */
            dialog.on('load', function () {
                    /**
                     * Hide url tab as we can insert in picker only images from our library.
                     * When it will be implemented functionality upload external image to server
                     * then this can disappear
                     *
                     */
                    dialog.holder.find('li[aria-controls="external-image-area"]').hide();
                })
                .on('insert', function (record) {
                    that.insert(record);
                    dialog.close();
                });

            return dialog;
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
            this.trigger('insert');

            return this;
        }
    });

    /**
     *
     * @expose
     * @param  {jQuery} holder
     * @param  {refinery.UserInterface} ui
     * @return {undefined}
     */
    refinery.admin.ui.imagePicker = function (holder, ui) {
        holder.find('.image-picker').each(function () {
            ui.addObject(
                refinery('admin.ImagePicker').init(
                    $(this),
                    refinery('admin.ImagesDialog')
                )
            );
        });
    };

}(refinery));
