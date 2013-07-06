(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({
            objectPrototype: refinery('admin.Dialog', {
                title: t('refinery.admin.links_dialog_title'),
                url: '/refinery/dialogs/links'
            }, true),

            name: 'LinksDialog',

            after_load: function () {
                this.holder.find('.records li').first().addClass('ui-selected');
            },

            /**
             * Dialog email tab action processing
             *
             * @param {!jQuery} tab
             *
             * @return {?{title: string, url: string}}
             */
            email_tab: function (tab) {
                var email_input = tab.find('#email_address_text:valid'),
                    subject_input = tab.find('#email_default_subject_text'),
                    body_input = tab.find('#email_default_body_text'),
                    recipient = /** @type {string} */(email_input.val()),
                    subject = /** @type {string} */(subject_input.val()),
                    body = /** @type {string} */(body_input.val()),
                    modifier = '?',
                    additional = '',
                    result = null,
                    i;

                subject = encodeURIComponent(subject);
                body = encodeURIComponent(body);

                if (recipient) {
                    if (subject.length > 0) {
                        additional += modifier + 'subject=' + subject;
                        modifier = '&';
                    }

                    if (body.length > 0) {
                        additional += modifier + 'body=' + body;
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
             * @return {?{title: string, url: string, blank: boolean}}
             */
            website_tab: function (tab) {
                var url_input = tab.find('#web_address_text:valid'),
                    blank_input = tab.find('#web_address_target_blank'),
                    url = /** @type {string} */(url_input.val()),
                    blank = /** @type {boolean} */(blank_input.prop('checked')),
                    result = null;

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
             * Process insert action by tab type
             *
             * @return {Object} self
             */
            insert: function () {
                var holder = this.holder,
                    tab = holder.find('div[aria-expanded="true"]'),
                    obj = null;

                switch (tab.attr('id')) {
                case 'links-dialog-pages':
                    obj = tab.find('.ui-selected').data('link');
                    obj.type = 'page';

                    break;
                case 'links-dialog-website':
                    obj = this.website_tab(tab);

                    break;
                case 'links-dialog-email':
                    obj = this.email_tab(tab);

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
