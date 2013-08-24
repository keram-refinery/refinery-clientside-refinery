(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({
            objectPrototype: refinery('admin.Dialog', {
                title: t('refinery.admin.pages_dialog_title'),
                url: '/refinery/dialogs/pages'
            }, true),

            name: 'PagesDialog',

            after_load: function () {
                var that = this,
                    holder = that.holder,
                    form = holder.find('form');

                holder.on('selectableselected', '.ui-selectable', function () {
                    that.insert();
                });

                form.on('submit', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    that.insert();
                });
            },

            /**
             * Dialog email tab action processing
             *
             * @param {!jQuery} tab
             *
             * @return {?pages_dialog_object}
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
                    /** @type {?pages_dialog_object} */
                    result = null;

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
             * @return {?pages_dialog_object}
             */
            website_tab: function (tab) {
                var url_input = tab.find('#web_address_text:valid'),
                    blank_input = tab.find('#web_address_target_blank'),
                    url = /** @type {string} */(url_input.val()),
                    blank = /** @type {boolean} */(blank_input.prop('checked')),
                    /** @type {?pages_dialog_object} */
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
             * Dialog Url tab action processing
             *
             * @param {!jQuery} tab
             *
             * @return {?pages_dialog_object}
             */
            pages_tab: function (tab) {
                var li = tab.find('li.ui-selected'),
                    /** @type {?pages_dialog_object} */
                    result = null;

                if (li.length > 0) {
                    result = /** @type {?pages_dialog_object} */(li.data('link'));
                    result.type = 'page';
                    li.removeClass('ui-selected');
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
                    /** @type {?pages_dialog_object} */
                    obj = null;

                switch (tab.attr('id')) {
                case 'pages-link-area':
                    obj = this.pages_tab(tab);

                    break;
                case 'website-link-area':
                    obj = this.website_tab(tab);

                    break;
                case 'email-link-area':
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
