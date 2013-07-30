(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({
        objectPrototype: refinery('admin.Dialog', {
            title: t('refinery.admin.resources_dialog_title'),
            url: '/refinery/dialogs/resources'
        }, true),

        name: 'ResourcesDialog',

        after_load: function () {
            this.holder.find('.records li').first().addClass('ui-selected');
        },

        /**
         * Propagate selected file wth attributes to dialog observers
         *
         * @return {Object} self
         */
        insert: function () {
            var li = this.holder.find('.ui-selected'),
                /** @type {?file_dialog_object} */
                obj = null;

            if (li.length > 0) {
                obj = {
                    id: li.attr('id').replace('dialog-resource-', ''),
                    url: li.data('url'),
                    html: li.html(),
                    type: 'library'
                };

                this.trigger('insert', obj);
            }

            return this;
        }
    });

}());
