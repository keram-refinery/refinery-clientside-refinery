(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({

            objectPrototype: refinery.n('admin.Dialog', {
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
             * @return {Object}
             */
            library_tab: function (tab) {
                var img = tab.find('.ui-selected .image img'),
                    size_elm = tab.find('.image-dialog-size.selected a'),
                    resize = tab.find('input:checkbox').is(':checked'),
                    obj = null;

                if (img.length > 0) {
                    obj = img.data();
                    obj.type = 'library';

                    if (size_elm.length > 0) {
                        obj.size = resize ? size_elm.data('size') : 'original';
                        obj.geometry = size_elm.data('geometry');
                    }
                }

                return obj;
            },

            /**
             * Handle image linked by url
             *
             * @return {Object}
             */
            url_tab: function (tab) {
                var url_input = tab.find('input.text:valid'),
                    url = url_input.val(),
                    obj = null;

                if (url) {
                    obj = {
                        'original': url,
                        'type': 'external'
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
             * @expose
             *
             * @return {undefined}
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
            }
        });

}());
