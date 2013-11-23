
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
            url_path: '/dialogs/images'
        }, true),

        name: 'ImagesDialog',

        /**
         * Handle image linked by url
         *
         * @expose
         * @param {!jQuery} form
         * @return {undefined|images_dialog_object}
         */
        external_image_area: function (form) {
            var url_input = form.find('input[type="url"]:valid'),
                alt_input = form.find('input[type="text"]:valid'),
                url = /** @type {string} */(url_input.val()),
                alt = /** @type {string} */(alt_input.val());

            if (url) {
                url_input.val('');
                alt_input.val('');

                return {
                    url: url,
                    alt: alt
                };
            }
        },

        /**
         * Handle uploaded image
         *
         * @expose
         * @param {json_response} json_response
         * @return {undefined}
         */
        upload_area: function (json_response) {
            if (json_response.image) {
                this.trigger('insert', json_response.image);
                this.holder.find('li.ui-selected').removeClass('ui-selected');
                this.holder.find('.ui-tabs').tabs({ 'active': 0 });
            }
        }
    });

}(refinery));
