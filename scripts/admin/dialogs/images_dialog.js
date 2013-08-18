(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({

            objectPrototype: refinery('admin.Dialog', {
                title: t('refinery.admin.images_dialog_title'),
                url: '/refinery/dialogs/images'
            }, true),

            name: 'ImagesDialog',

            /**
             * Select first image in library
             * Put focus to first text input element
             *
             * @return {undefined}
             */
            after_load: function () {
                this.holder.find('.records li').first().addClass('ui-selected');
                this.holder.find('input.text:visible').focus();
            },

            /**
             * Handle image linked from library
             *
             * @return {?images_dialog_object}
             */
            library_tab: function (tab) {
                var img = tab.find('.ui-selected .image img'),
                    /** @type {?images_dialog_object} */
                    obj = null;

                if (img.length > 0) {
                    obj = {
                        id: img.closest('li').attr('id').replace('image-', '') * 1,
                        type: 'library'
                    }
                }

                return obj;
            },

            /**
             * Handle image linked by url
             *
             * @return {?images_dialog_object}
             */
            url_tab: function (tab) {
                var url_input = tab.find('input.text:valid'),
                    url = url_input.val(),
                    /** @type {?images_dialog_object} */
                    obj = null;

                if (url) {
                    obj = {
                        url: url,
                        type: 'external'
                    };
                }

                return obj;
            },

            /**
             * Handle upload
             *
             * @return {undefined}
             */
            upload_tab: function () {

            },

            /**
             * Propagate selected image wth attributes to dialog observers
             *
             * @return {Object} self
             */
            insert: function () {
                var tab = this.holder.find('div[aria-expanded="true"]'),
                    obj = null;

                switch (tab.attr('id')) {
                case 'existing-image-area':
                    obj = this.library_tab(tab);

                    break;
                case 'external-image-area':
                    obj = this.url_tab(tab);

                    break;
                default:
                    break;
                }

                if (obj) {
                    this.trigger('insert', obj);
                }

                return this;
            }
        });

}());
