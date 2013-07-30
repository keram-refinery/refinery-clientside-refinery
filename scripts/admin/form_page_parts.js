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
                holder = that.holder,
                tab_id = holder.tabs('option', 'active'),
                part_title = that.page_parts.find('.ui-state-active a').text(),
                input_page_parts_attributes_id = $('#page_parts_attributes_' + tab_id + '_id');

            if (confirm(t('refinery.admin.form_page_parts_remove', { 'title': part_title }))) {
                holder.find('.ui-tabs-nav li:eq(' + tab_id + ')').remove();
                holder.find('.ui-tabs-panel:eq(' + tab_id + ')').remove();
                holder.find('.ui-tabs-nav li a').each(function (i) {
                    holder.find($(this).attr('href') + ' .part-position').val(i);
                });
                holder.tabs('refresh');

                if (input_page_parts_attributes_id.length > 0) {
                    $.ajax({
                        url: delete_url + '/' + input_page_parts_attributes_id.val(),
                        type: 'DELETE',
                        dataType: 'JSON',
                        success: function () {
                            input_page_parts_attributes_id.remove();
                            that.trigger('part:delete');
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
                part_index = that.holder.find('.ui-tabs-nav li').length,
                tab_title = '#page_part_' + part_title.toLowerCase().replace(/\s/g, '_'),
                tab_tpl,
                process_response;

            process_response = function (response) {
                if (response.html) {
                    tab_tpl = '<li><a href="' + tab_title + '">' + part_title + '</a></li>';

                    page_part_editors.append(response.html);
                    that.page_parts.append(tab_tpl);
                    that.holder.tabs('refresh');
                    that.holder.tabs('option', 'active', part_index);
                    that.dialog_holder.dialog('close');
                    input_title.val('');
                    that.trigger('part:add');
                } else {
                    refinery.flash('error', t('refinery.xhr_error'));
                }
            };

            if (part_title.length > 0) {
                if ($(tab_title).length === 0) {
                    $.getJSON(add_url, { 'title': part_title, 'part_index': part_index })
                        .fail(function () {
                            refinery.flash('error', t('refinery.xhr_error'));
                        })
                        .done(function (response) {
                            process_response(response);
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
                dialog_holder = that.dialog_holder,
                input_title = dialog_holder.find('#new-page-part-title');

            add_page_part_btn.on('click', function (e) {
                e.preventDefault();

                dialog_holder.dialog({
                    title: t('refinery.admin.form_page_parts_add_part_dialog_title'),
                    modal: true,
                    resizable: false,
                    autoOpen: true,
                    width: 400,
                    height: 240
                });

                dialog_holder.removeClass('hide');
            });

            delete_page_part_btn.on('click', function (e) {
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
                that.dialog_holder = $('<div/>', {
                    html: '<div class="field">' +
                          '  <input class="larger widest" placeholder="' +
                            t('refinery.admin.label_title') +
                          '" id="new-page-part-title">' +
                          '  <input type="hidden" id="new-page-part-index">' +
                          '</div>' +
                          '<div class="form-actions clearfix">' +
                          '  <div class="form-actions-left">' +
                          '    <input type="submit" value="' +
                            t('refinery.admin.button_create') +
                          '" class="button submit-button">' +
                          '  </div>' +
                          '</div>'
                });

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
            this.holder.tabs('disable');
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
            this.holder.tabs('enable');
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
                    that.holder.find('.ui-tabs-nav li a').each(function (i) {
                        that.holder.find($(this).attr('href') + ' .part-position').val(i);
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
         * @param {boolean=} removeGlobalReference if is true instance will be removed
         *                   from refinery.Object.instances
         *
         * @return {Object} self
         */
        destroy: function (removeGlobalReference) {
            if (this.is('initialised')) {
                this.page_parts = null;
                this.holder.parent()
                    .find('#reorder-page-part, #reorder-page-part-done, #add-page-part, #delete-page-part')
                    .off();
                this.reorder_page_part_done_btn = null;
                this.reorder_page_part_btn = null;

                if (this.dialog_holder) {
                    if (this.dialog_holder.hasClass('ui-dialog')) {
                        this.dialog_holder.dialog('destroy');
                    }

                    this.dialog_holder.off();
                    this.dialog_holder.remove();
                    this.dialog_holder = null;
                }

                this.fade_elements = null;
            }
            refinery.Object.prototype.destroy.apply(this, [removeGlobalReference]);

            return this;
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
                this.attach_holder(holder);
                this.page_parts = holder.find('#page-parts');
                this.init_add_remove_part();
                this.init_reorder_parts();
                this.is({'initialised': true, 'initialising': false});
                this.trigger('init');
            }

            return this;
        }
    });

    /**
     * Form initialization
     *
     * @expose
     * @param  {jQuery} holder
     * @param  {Object} ui
     * @return {undefined}
     */
    refinery.admin.ui.formPageParts = function (holder, ui) {
        holder.find('#page-tabs').each(function () {
            var page_parts = refinery('admin.FormPageParts').init($(this));

            page_parts.on('part:add', function () {
                ui.reload(holder);
            });
            page_parts.on('part:delete', function () {
                ui.reload(holder);
            });
        });
    };

}());
