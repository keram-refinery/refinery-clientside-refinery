
(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     * @return {refinery.admin.ResourcesDialog}
     */
    refinery.Object.create({
        objectPrototype: refinery('admin.Dialog', {
            title: t('refinery.admin.resources_dialog_title'),
            url: refinery.admin.backend_path + '/dialogs/resources'
        }, true),

        name: 'ResourcesDialog',

        /**
         * Handle resource linked from library
         *
         * @expose
         * @param {!jQuery} li
         * @return {file_dialog_object}
         */
        existing_resource_area: function (li) {
            li.removeClass('ui-selected');

            return /** @type {file_dialog_object} */(li.data('dialog'));
        },

        /**
         * Handle uploaded file
         *
         * @param {json_response} json_response
         * @return {undefined}
         */
        upload_area: function (json_response) {
            var that = this,
                file = json_response.file,
                holder = that.holder;

            if (file) {
                that.trigger('insert', file);

                holder.find('li.ui-selected').removeClass('ui-selected');
                holder.find('.ui-tabs').tabs({ 'active': 0 });
            }
        }
    });

}(refinery));
