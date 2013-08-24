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
            var that = this,
                holder = that.holder;

            holder.on('selectableselected', '.ui-selectable', function () {
                that.library_tab();
            });

            holder.on('ajax:success', function (xhr, response) {
                that.upload_tab(response.file);
            });
        },

        /**
         * Handle resource linked from library
         *
         * @return {Object} self
         */
        library_tab: function () {
            var that = this,
                tab = that.holder.find('div[aria-expanded="true"]'),
                li = tab.find('li.ui-selected');

            if (li.length > 0) {
                li.removeClass('ui-selected');
                that.trigger('insert', li.data('dialog'));
            }

            return that;
        },

        /**
         * Handle uploaded file
         *
         * @param {file_dialog_object} file
         * @return {Object} self
         */
        upload_tab: function (file) {
            var that = this,
                holder = that.holder;

            if (file) {
                that.trigger('insert', file);

                holder.find('li.ui-selected').removeClass('ui-selected');
                holder.find('.ui-tabs').tabs({ 'active': 0 });
            }

            return that;
        },

        /**
         * Propagate selected resource wth attributes to dialog observers
         *
         * @return {Object} self
         */
        insert: function () {

            return this;
        }
    });

}());
