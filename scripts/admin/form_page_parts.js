(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.Object}
     * @param {Object=} options
     */
    refinery.Object.create({

        name: 'FormPageParts',

        module: 'admin',

        /**
         * @type {string}
         */
        fade_elements_selector: '#menu, #add-page-part, #delete-page-part, ' +
                                '.locale-picker, .field:not(:has(#page-tabs)), ' +
                                '#page-part-editors, #more-options-field, .form-actions',

        /**
         * Delete page part
         *
         * @param {string} delete_url
         *
         * @return {undefined}
         */
        delete_part: function (delete_url) {
            var that = this,
                tabId = this.holder.tabs('option', 'active'),
                part_title = that.page_parts.find('.ui-state-active a').text(),
                input_page_parts_attributes_id = $('#page_parts_attributes_' + tabId + '_id');

            if (confirm(t('refinery.admin.form_page_parts_remove', { 'title': part_title }))) {
                that.holder.find('.ui-tabs-nav li:eq(' + tabId + ')').remove();
                that.holder.find('.ui-tabs-panel:eq(' + tabId + ')').remove();
                that.holder.tabs('refresh');

                if (input_page_parts_attributes_id.length > 0) {
                    $.ajax({
                        url: delete_url + '/' + input_page_parts_attributes_id.val(),
                        type: 'DELETE',
                        dataType: 'JSON',
                        success: function () {
                            input_page_parts_attributes_id.remove();
                        }
                    });
                }
            }
        },

        /**
         * Add part
         *
         * @param {string} add_url
         * @param {jQuery} input_title
         *
         * @return {undefined}
         */
        add_part: function (add_url, input_title) {
            var that = this,
                part_title = $.trim(/** @type {string} */(input_title.val())),
                page_part_editors = $('#page-part-editors'),
                part_index = $('#new-page-part-index').val(),
                tab_title = '#page_part_' + part_title.toLowerCase().replace(/\s/g, '_'),
                tab_tpl;

            if (part_title.length > 0) {
                if ($(tab_title).length === 0) {
                    tab_tpl = '<li><a href="' + tab_title + '">' + part_title + '</a></li>';

                    $.get(add_url, { title: part_title, part_index: part_index }, 'JSON')
                        .fail(function () {
                            refinery.flash('error', t('refinery.xhr_error'));
                        })
                        .done(function (response) {
                            if (response.html) {
                                page_part_editors.append(response.html);
                                that.page_parts.append(tab_tpl);
                                that.holder.tabs('refresh');
                                that.holder.tabs('option', 'active', part_index);
                                that.dialog_holder.dialog('close');
                                input_title.val('');
                            } else {
                                alert(t('refinery.xhr_error'));
                            }
                        });

                } else {
                    alert(t('refinery.admin.form_page_parts_part_exist'));
                }
            } else {
                alert(t('refinery.admin.form_page_parts_title_missing'));
            }
        },

        /**
         * Bind add, delete events to buttons
         *
         * @param {jQuery} add_page_part_btn
         * @param {jQuery} delete_page_part_btn
         *
         * @return {undefined}
         */
        bind_add_delete_part_events_to_buttons: function (add_page_part_btn, delete_page_part_btn) {
            var that = this,
                dialog_holder = this.dialog_holder,
                input_title = $('#new-page-part-title');

            add_page_part_btn.click(function (e) {
                e.preventDefault();

                that.dialog_holder.dialog({
                    title: t('refinery.admin.form_page_parts_add_part_dialog_title'),
                    modal: true,
                    resizable: false,
                    autoOpen: true,
                    width: 400,
                    height: 240
                });

                dialog_holder.removeClass('hide');
            });

            delete_page_part_btn.click(function (e) {
                e.preventDefault();
                that.delete_part(delete_page_part_btn.attr('href'));
            });

            dialog_holder.on('click', '.cancel-button', function (e) {
                e.preventDefault();
                dialog_holder.dialog('close');
                input_title.val('');
            });

            dialog_holder.on('click', '.submit-button', function (e) {
                e.preventDefault();
                that.add_part(add_page_part_btn.attr('href'), input_title);

            });

            input_title.keypress(function (e) {
                if (e.which === 13) {
                    e.preventDefault();
                    that.add_part(add_page_part_btn.attr('href'), input_title);
                }
            });
        },

        /**
         * Initialize page part dialog and bind events
         *
         * @return {undefined}
         */
        init_add_remove_part: function () {
            var that = this,
                add_page_part_btn = $('#add-page-part'),
                delete_page_part_btn = $('#delete-page-part');

            if (add_page_part_btn.length > 0 && delete_page_part_btn.length > 0) {
                that.dialog_holder = $('#new-page-part-dialog');

                that.bind_add_delete_part_events_to_buttons(add_page_part_btn,
                    delete_page_part_btn);
            }
        },

        /**
         * Handle reordering
         *
         * @return {undefined}
         */
        start_reordering_page_parts: function () {
            this.page_parts.addClass('reordering');
            this.reorder_page_part_btn.addClass('hide');
            this.reorder_page_part_done_btn.removeClass('hide');
            this.page_parts.sortable('enable');
            this.fade_elements.fadeTo(500, 0.3);
        },

        /**
         * Handle stoping reordering
         *
         * @return {undefined}
         */
        stop_reordering_page_parts: function () {
            this.page_parts.removeClass('reordering');
            this.reorder_page_part_done_btn.addClass('hide');
            this.reorder_page_part_btn.removeClass('hide');
            this.page_parts.sortable('disable');
            this.fade_elements.fadeTo(500, 1);
        },

        /**
         * Initialize parts reordering
         *
         * @return {undefined}
         */
        init_reorder_parts: function () {
            var that = this;

            that.page_parts.sortable({
                items: 'li',
                enabled: false,
                stop: function () {
                    that.page_parts.find('li[data-index]').each(function (i) {
                        $('#page_parts_attributes_' + $(this).data('index') + '_position').val(i + 1);
                    });
                }
            }).sortable('disable');

            that.reorder_page_part_btn = $('#reorder-page-part');
            that.reorder_page_part_done_btn = $('#reorder-page-part-done');
            that.reorder_page_part_btn.on('click', function (e) {
                e.preventDefault();
                that.start_reordering_page_parts();
            });

            that.reorder_page_part_done_btn.on('click', function (e) {
                e.preventDefault();
                that.stop_reordering_page_parts();
            });

            that.fade_elements = $(that.fade_elements_selector);
        },

        /**
         *
         * @expose
         *
         * @return {undefined}
         */
        destroy: function () {
            this.page_parts.unbind();
            this.page_parts = null;
            this.reorder_page_part_done_btn = null;
            this.reorder_page_part_btn = null;
            this.dialog_holder = null;
            this.fade_elements = null;
            refinery.Object.prototype.destroy.call(this);
        },

        /**
         * initialisation
         *
         * @param {!jQuery} holder
         *
         * @return {Object} self
         */
        init: function (holder) {
            if (this.is('initialisable')) {
                this.is('initialising', true);
                this.holder = holder;
                this.page_parts = holder.find('#page-parts');
                this.init_add_remove_part();
                this.init_reorder_parts();
                this.is({'initialised': true, 'initialising': false});
                this.trigger('init');
            }

            return this;
        }
    });

}());
