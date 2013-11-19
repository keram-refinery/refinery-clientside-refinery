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
         */
        bind_dialog: function (dialog) {
            var that = this;

            dialog.on('insert', function (record) {
                that.insert(record);
                dialog.close();
            });

            return dialog;
        },

        /**
         * Attach resource - file to form
         *
         * @param {file_dialog_object} file
         *
         * @return {Object} self
         */
        insert: function (file) {
            var html = $('<span/>', {
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
    refinery.admin.ui.resourcePicker = function (holder, ui) {
        holder.find('.resource-picker').each(function () {
            ui.addObject(
                refinery('admin.ResourcePicker').init(
                    $(this),
                    refinery('admin.ResourcesDialog')
                )
            );
        });
    };

}(refinery));
