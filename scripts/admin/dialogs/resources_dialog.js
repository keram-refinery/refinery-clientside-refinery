(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({
        objectPrototype: refinery.n('admin.Dialog', {
            title: t('refinery.admin.resources_dialog_title'),
            url: '/refinery/dialogs/resources'
        }, true),

        name: 'ResourcesDialog',

        after_load: function () {
            this.holder.find('.records li').first().addClass('ui-selected');
        },

        /**
         * Propagate selected image wth attributes to dialog observers
         *
         * @expose
         *
         * @return {undefined}
         */
        insert: function () {
            var li = this.holder.find('.ui-selected'),
                obj = {};

            if (li.length > 0) {
                obj.id = li.attr('id').replace('dialog-resource-', '');
                obj.url = li.data('url');
                obj.html = li.html();
                this.trigger('insert', obj);
            }
        }
    });

}());
