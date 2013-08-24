(function () {

    'use strict';

    /**
     * @constructor
     * @class  refinery.admin.Form
     * @extends {refinery.Object}
     * @param {Object=} options
     */
    refinery.Object.create({

        name: 'Form',

        module: 'admin',

        /**
         * Switch locale
         *
         * @param {!jQuery} anchor
         *
         * @return {undefined}
         */
        switch_frontend_locale: function (anchor) {
            var buttons = {},
                url = anchor.attr('href'),
                that = this;

            buttons[t('refinery.admin.form_unsaved_save_and_continue')] = function () {
                var form = that.holder,
                    dialog = $(this),
                    param = url.match(/\?[^\?]+$/)[0];

                $.ajax({
                    url: form.attr('action'),
                    method: form.attr('method'),
                    data: form.serialize(),
                    dataType: 'JSON',
                    success: function (response, status, xhr) {
                        var redirected = xhr.getResponseHeader('X-XHR-Redirected-To');

                        dialog.dialog('close');
                        dialog.dialog('destroy');

                        if (redirected) {
                            Turbolinks.visit(redirected + param);
                        } else if (status === 'error') {
                            refinery.xhr.success(response, status, xhr, form, true);
                        } else {
                            Turbolinks.visit(url);
                        }
                    }
                });
            };

            buttons[t('refinery.admin.form_unsaved_continue')] = function () {
                Turbolinks.visit(url);
            };

            buttons[t('refinery.admin.form_unsaved_cancel')] = function () {
                $(this).dialog('close');
                $(this).dialog('destroy');
            };

            $('<div/>', { html: t('refinery.admin.form_unsaved_html')} ).dialog({
                'resizable': false,
                'height': 140,
                'modal': true,
                'title': t('refinery.admin.form_unsaved_title'),
                'buttons': buttons
            });
        },

        init_pickers: function () {
            var that = this,
                form = that.holder;

            form.find('.image-picker').each(function () {
                var picker = refinery('admin.ImagePicker');
                picker.init($(this));
            });

            form.find('.resource-picker').each(function () {
                var picker = refinery('admin.ResourcePicker');
                picker.init($(this));
            });

            form.on('click', '.locale-picker a', function (e) {
                var a = $(this);
                if (that.initial_values === form.serialize()) {
                    return true;
                }

                e.preventDefault();
                e.stopPropagation();
                that.switch_frontend_locale(a);
                return false;
            });
        },

        init_upload: function () {
            var that = this,
                form = that.holder,
                file_inputs = form.find('input[type="file"]');

            if (file_inputs.length > 0) {
                form.on('submit', function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    $.ajax(this.action, {
                            'data': form.serializeArray(),
                            'files': file_inputs,
                            'iframe': true,
                            'processData': false
                        }).done(
                        /**
                         * @param {json_response} response
                         * @param {string} status
                         * @param {jQuery.jqXHR} xhr
                         * @return {undefined}
                         */
                        function (response, status, xhr) {
                            form.trigger('ajax:success', [response, status, xhr]);
                        });
                });
            }
        },

        init_inputs: function () {
            var that = this,
                form = that.holder,
                submit_btn = form.find('.form-actions .submit-button'),
                submit_btn_val;

            if (submit_btn.length > 0) {
                submit_btn_val = submit_btn.val();
                form.on('change', 'input, select, textarea', function () {
                    if (that.initial_values !== form.serialize() &&
                        submit_btn_val[submit_btn_val.length] !== '!'
                    ) {
                        submit_btn.val(submit_btn_val + ' !');
                    } else {
                        submit_btn.val(submit_btn_val.replace(/ !$/, ''));
                    }
                });
            }
        },

        fly_form_actions: function (left_buttons, holder, $window) {
            var
                window_position = $window.scrollTop() + $window.height(),
                form_actions_pos = holder.position().top;

            if (window_position < form_actions_pos) {
                left_buttons.addClass('fly');
            } else {
                left_buttons.removeClass('fly');
            }
        },

        init_fly_form_actions: function () {
            var that = this,
                $window = $(window),
                holder = that.holder.find('.form-actions'),
                left_buttons = that.holder.find('.form-actions-left'),
                scroll_handler = function () {
                    that.fly_form_actions(left_buttons, holder, $window);
                };

            if (that.holder.find('textarea').length > 0 &&
                holder.length > 0 && left_buttons.length > 0) {

                that.fly_form_actions(left_buttons, holder, $window);
                $window.on('scroll', scroll_handler);
                that.on('destroy', function () {
                    $window.unbind('scroll', scroll_handler);
                });
            }
        },

        /**
         * initialisation
         *
         * @param {!jQuery} holder
         *
         * @return {Object} self
         */
        init: function (holder) {
            var that = this;

            if (that.is('initialisable')) {
                that.is('initialising', true);
                that.attach_holder(holder);
                that.init_pickers();
                that.init_inputs();
                that.init_upload();
                that.initial_values = holder.serialize();
                that.init_fly_form_actions();

                that.is({'initialised': true, 'initialising': false});
                that.trigger('init');
            }

            return that;
        }
    });

    /**
     * Form initialization
     *
     * @expose
     * @param  {jQuery} holder
     * @return {undefined}
     */
    refinery.admin.ui.form = function (holder) {
        holder.find('form').each(function () {
            refinery('admin.Form').init($(this));
        });
    };

}());
