
(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({

        objectPrototype: refinery('admin.Dialog', {
            title: t('refinery.admin.images_dialog_title'),
            url: refinery.admin.backend_path + '/dialogs/images'
        }, true),

        name: 'ImagesDialog',

        /**
         * Handle image linked from library
         *
         * @expose
         * @param {jQuery} tab
         * @return {undefined|{id: string}}
         */
        existing_image_area: function (tab) {
            var li = tab.find('li.ui-selected'),
                obj;

            if (li.length > 0) {
                obj = {
                    id: li.attr('id').match(/[0-9]+$/)[0]
                };

                li.removeClass('ui-selected');
            }

            return obj;
        },

        /**
         * Handle image linked by url
         *
         * @expose
         * @param {jQuery} tab
         * @return {undefined|{alt: string, url: string}}
         */
        external_image_area: function (tab) {
            var url_input = tab.find('input[type="url"]:valid'),
                alt_input = tab.find('input[type="text"]:valid'),
                url = /** @type {string} */(url_input.val()),
                alt = /** @type {string} */(alt_input.val()),
                obj;

            if (url) {
                obj = {
                    url: url,
                    alt: alt
                };

                url_input.val('');
                alt_input.val('');
            }

            return obj;
        },

        /**
         * Handle uploaded image
         *
         * @expose
         * @param {json_response} json_response
         * @return {undefined}
         */
        upload_area: function (json_response) {
            var that = this,
                image = json_response.image,
                holder = that.holder;

            if (image) {
                that.trigger('insert', image);
                holder.find('li.ui-selected').removeClass('ui-selected');
                holder.find('.ui-tabs').tabs({ 'active': 0 });
            }
        }
    });

}(refinery));
