
(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({

        /**
         * @param {image_dialog_options} options
         */
        objectConstructor: function (options) {
            options.url_path = '/dialogs/image/' + options.image_id;

            refinery.Object.apply(this, arguments);
        },

        objectPrototype: refinery('admin.Dialog', {
            title: t('refinery.admin.image_dialog_title')
        }, true),

        name: 'ImageDialog',

        /**
         * Propagate selected image wth attributes to dialog observers
         *
         * @param {!jQuery} form
         * @return {Object} self
         */
        insert: function (form) {
            var size_elm = form.find('#image-size .ui-selected a');

            return this.trigger('insert', {
                'id': form.find('#image-id').val(),
                'alt': form.find('#image-alt').val(),
                'size': size_elm.data('size'),
                'geometry': size_elm.data('geometry'),
                'sizes': form.find('#image-preview').data()
            });
        }
    });

}(refinery));
