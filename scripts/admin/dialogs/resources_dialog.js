
(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({
        objectPrototype: refinery('admin.Dialog', {
            title: t('refinery.admin.resources_dialog_title'),
            url_path: '/dialogs/resources'
        }, true),

        name: 'ResourcesDialog',

        /**
         * Handle uploaded file
         *
         * @param {json_response} json_response
         * @return {undefined}
         */
        upload_area: function (json_response) {
            if (json_response.file) {
                this.trigger('insert', json_response.file);

                this.holder.find('li.ui-selected').removeClass('ui-selected');
                this.holder.find('.ui-tabs').tabs({ 'active': 0 });
            }
        }
    });

}(refinery));
