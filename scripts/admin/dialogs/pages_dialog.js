(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({
        objectPrototype: refinery('admin.Dialog', {
            title: t('refinery.admin.pages_dialog_title'),
            url: refinery.admin.backend_path + '/dialogs/pages'
        }, true),

        name: 'PagesDialog',

        /**
         * Dialog email tab action processing
         *
         * @param {!jQuery} tab
         *
         * @return {undefined|pages_dialog_object}
         */
        email_link_area: function (tab) {
            var email_input = tab.find('#email_address_text:valid'),
                subject_input = tab.find('#email_default_subject_text'),
                body_input = tab.find('#email_default_body_text'),
                recipient = /** @type {string} */(email_input.val()),
                subject = /** @type {string} */(subject_input.val()),
                body = /** @type {string} */(body_input.val()),
                modifier = '?',
                additional = '',
                result;

            if (recipient) {
                if (subject.length > 0) {
                    additional += modifier + 'subject=' + encodeURIComponent(subject);
                    modifier = '&';
                }

                if (body.length > 0) {
                    additional += modifier + 'body=' + encodeURIComponent(body);
                    modifier = '&';
                }

                result = {
                    type: 'email',
                    title: recipient,
                    url: 'mailto:' + encodeURIComponent(recipient) + additional
                };

                email_input.val('');
                subject_input.val('');
                body_input.val('');
            }

            return result;
        },

        /**
         * Dialog Url tab action processing
         *
         * @param {!jQuery} tab
         *
         * @return {undefined|pages_dialog_object}
         */
        website_link_area: function (tab) {
            var url_input = tab.find('#web_address_text:valid'),
                blank_input = tab.find('#web_address_target_blank'),
                url = /** @type {string} */(url_input.val()),
                blank = /** @type {boolean} */(blank_input.prop('checked')),
                result;

            if (url) {
                result = {
                    type: 'website',
                    title: url.replace(/^https?:\/\//, ''),
                    url: url,
                    blank: blank
                };

                url_input.val('http://');
                blank_input.prop('checked', false);
            }

            return result;
        },

        /**
         * Dialog Url tab action processing
         *
         * @expose
         * @param {!jQuery} tab
         *
         * @return {undefined|pages_dialog_object}
         */
        pages_link_area: function (tab) {
            var li = tab.find('li.ui-selected'),
                result;

            if (li.length > 0) {
                result = /** @type {pages_dialog_object} */(li.data('dialog'));
                result.type = 'page';
                li.removeClass('ui-selected');
            }

            return result;
        }
    });

}(refinery));
