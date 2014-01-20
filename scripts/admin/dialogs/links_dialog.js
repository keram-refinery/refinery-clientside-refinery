(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({
        objectPrototype: refinery('admin.Dialog', {
            title: t('refinery.admin.links_dialog_title'),
            url_path: '/dialogs/links'
        }, true),

        name: 'LinksDialog',

        /**
         * Dialog email tab action processing
         *
         * @param {!jQuery} form
         * @expose
         *
         * @return {undefined|links_dialog_object}
         */
        email_link_area: function (form) {
            var email_input = form.find('#email_address_text:valid'),
                subject_input = form.find('#email_default_subject_text'),
                body_input = form.find('#email_default_body_text'),
                recipient = /** @type {string} */(email_input.val()),
                subject = /** @type {string} */(subject_input.val()),
                body = /** @type {string} */(body_input.val()),
                url = '';

            if (recipient) {
                url = 'mailto:' + encodeURIComponent(recipient) +
                        '?subject=' + encodeURIComponent(subject) +
                        '&body=' + encodeURIComponent(body);

                email_input.val('');
                subject_input.val('');
                body_input.val('');

                return {
                    type: 'email',
                    title: recipient,
                    url: url
                };
            }
        },

        /**
         * Dialog Url tab action processing
         *
         * @param {!jQuery} form
         * @expose
         *
         * @return {undefined|links_dialog_object}
         */
        website_link_area: function (form) {
            var url_input = form.find('#web_address_text:valid'),
                blank_input = form.find('#web_address_target_blank'),
                url = /** @type {string} */(url_input.val()),
                blank = /** @type {boolean} */(blank_input.prop('checked'));

            if (url) {
                url_input.val('http://');
                blank_input.prop('checked', false);

                return {
                    type: 'website',
                    title: url.replace(/^https?:\/\//, ''),
                    url: url,
                    blank: blank
                };
            }
        }
    });

}(refinery));
