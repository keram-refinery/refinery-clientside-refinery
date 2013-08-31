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
         * Initialize Resources Dialog
         *
         */
        init_dialog: function () {
            /**
             * refinery.admin.ResourcesDialog
             */
            this.dialog = refinery('admin.ResourcesDialog').init();
        },


        /**
         * Attach resource - file to form
         *
         * @param {file_dialog_object} file
         *
         * @return {Object} self
         */
        insert: function (file) {
            var html;

            html = $('<span/>', {
                'text': file.name + ' - ' + file.size,
                'class': 'title' + ( ' ' + file.ext || '')
            });

            this.elm_current_record_id.val(file.id);

            this.elm_record_holder.html($('<a/>', {
                'src': file.url,
                'html': html,
                'class': 'record'
            }));

            this.elm_no_picked_record.addClass('hide');
            this.elm_remove_picked_record.removeClass('hide');
            this.dialog.close();
            this.trigger('insert');

            return this;
        }

    });

}(refinery));
