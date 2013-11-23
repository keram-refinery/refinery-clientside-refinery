/*global $, refinery */

(function (refinery) {

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

        absolutize_url: function (url) {
            var loc = window.location;

            if (/^http(s)?:/.test(url)) {
                return url;
            }

            return loc.protocol + '//' + loc.host + url;
        },

        get_right_url: function(url, redirected_to) {
            var locale_param, locale_param_re,
                redirected_url_parts, redirected_locale_param;

            url = this.absolutize_url(url);

            if (redirected_to) {
                locale_param_re = /^[a-z]{2}(-[a-zA-Z]{2,3})?$/;
                locale_param = url.split('/')[3];
                redirected_url_parts = redirected_to.split('/');
                redirected_locale_param = redirected_url_parts[3];

                if (locale_param_re.test(redirected_locale_param)) {
                    if (locale_param_re.test(locale_param)) {
                        redirected_url_parts.splice(3, 1, locale_param);
                    } else {
                        redirected_url_parts.splice(3, 1);
                    }
                } else {
                    redirected_url_parts = [].concat(
                        redirected_url_parts.splice(0, 3), locale_param, redirected_url_parts
                    );
                }

                return redirected_url_parts.join('/');
            }

            return url;
        },

        /**
         * Switch locale
         *
         * @param {!jQuery} anchor
         *
         * @return {undefined}
         */
        switch_frontend_locale: function (anchor) {
            var that = this,
                url = anchor.attr('href'),
                /** @type {jquery_ui_button} */
                save_and_continue_btn,
                /** @type {jquery_ui_button} */
                continue_btn,
                /** @type {jquery_ui_button} */
                cancel_btn,
                dialog;

            save_and_continue_btn = {
                text: t('refinery.admin.form_unsaved_save_and_continue'),
                'class': 'submit-button',
                click: function () {
                    var form = that.holder;

                    /**
                     * Process ajax response
                     *
                     * @param  {json_response} response
                     * @param  {string} status
                     * @param  {jQuery.jqXHR} xhr
                     * @return {undefined}
                     */
                    function save_success (response, status, xhr) {
                        dialog.dialog('destroy');

                        if (status === 'error') {
                            refinery.xhr.success(response, status, xhr, form, true);
                        } else {
                            Turbolinks.visit(
                                that.get_right_url(url, xhr.getResponseHeader('X-XHR-Redirected-To'))
                            );
                        }
                    }

                    form.trigger('before-submit');

                    $.ajax({
                        url: form.attr('action'),
                        method: form.attr('method'),
                        data: form.serialize(),
                        dataType: 'JSON'
                    }).done(save_success);
                }
            };

            continue_btn = {
                text: t('refinery.admin.form_unsaved_continue'),
                click: function () {
                    dialog.dialog('destroy');
                    Turbolinks.visit(url);
                }
            };

            cancel_btn = {
                text: t('refinery.admin.form_unsaved_cancel'),
                click: function () {
                    dialog.dialog('destroy');
                }
            };

            dialog = $('<div/>', { html: t('refinery.admin.form_unsaved_html')} ).dialog({
                'resizable': false,
                'height': 140,
                'modal': true,
                'title': t('refinery.admin.form_unsaved_title'),
                'buttons': [save_and_continue_btn, continue_btn, cancel_btn]
            });

            that.on('destroy', function () {
                dialog.dialog('destroy');
            });
        },

        init_locale_picker: function () {
            var that = this,
                form = that.holder;

            form.on('click', '.locale-picker a', function (e) {
                if (that.initial_values !== form.serialize()) {
                    e.preventDefault();
                    e.stopPropagation();
                    that.switch_frontend_locale($(this));
                }
            });
        },

        init_upload: function () {
            var that = this,
                form = that.holder,
                csrf_param = $('meta[name=csrf-param]').attr('content'),
                file_inputs = form.find('input[type="file"]');

            if (file_inputs.length > 0) {
                form.on('submit', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    refinery.spinner.on();

                    /**
                     * when form doesn't have included csrf token aka
                     * embed_authenticity_token_in_remote_forms is false
                     * then include it to hidden input from meta
                     */
                    if (form.find('input[name="' + csrf_param + '"]').length === 0) {
                        $('<input/>', {
                            'name': csrf_param,
                            'type': 'hidden',
                            'value': $('meta[name=csrf-token]').attr('content')
                        }).appendTo(form);
                    }

                    form.trigger('before-submit');

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
                        }).always(function () {
                            refinery.spinner.off();
                        });
                });
            }
        },

        /**
         * Handle click on preview button
         * If preview window exists it is refreshed after form change.
         *
         * @return {undefined}
         */
        init_preview: function () {
            var form = this.holder,
                prev_url = form.attr('action'),
                prev_target = form.attr('target'),
                prev_method = form.attr('method'),
                prev_remote = form.data('remote'),
                preview_btn = form.find('.preview-button'),
                preview_window;

            /**
             * @param  {Object} event
             * @return {undefined}
             */
            function stop_event_propagation (event) {
                event.stopPropagation();
            }

            /**
             * Submits form to window with name href attribute of preview link button.
             * If window doesn't exists or was closed create it at first.
             *
             * @return {undefined}
             */
            function preview_submit () {
                if (form.is(':valid')) {
                    // removing jquery_ujs form submit handle
                    form.removeData('remote');
                    form.removeAttr('data-remote');

                    if (!preview_window || preview_window.closed) {
                        preview_window = window.open('', preview_btn.attr('href'));
                    }

                    form.attr({
                        'action': preview_btn.attr('href'),
                        'method': 'POST',
                        'target': preview_btn.attr('href')
                    });

                    // trigger before-submit for listeners
                    form.trigger('before-submit');

                    // disable other events on form submit (jquery_ujs etc..)
                    form.on('submit', stop_event_propagation);

                    // submit to new window/tab
                    form.submit();

                    // enable other events on form submit
                    form.off('submit', stop_event_propagation);

                    form.attr({
                        'action': prev_url,
                        'method': prev_method,
                        'target': prev_target
                    });

                    if (prev_remote) {
                        form.attr('data-remote', prev_remote);
                        form.data('remote', prev_remote);
                    }
                } else {
                    // @todo
                    alert('Preview is not possible because form is not filled properly!');
                }
            }

            if (preview_btn.length > 0) {
                form.on('click', '.preview-button', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    preview_submit();
                });

                form.on('change', 'input, select, textarea', function () {
                    if (preview_window && !preview_window.closed) {
                        preview_submit();
                    }
                });
            }
        },

        /**
         * Include exclamation mark to submit button if form has unsaved changes.
         *
         * @return {undefined}
         */
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

            function split( val ) {
                return val.split( /,\s*/ );
            }

            /**
             * @todo support for remote source
             * @return {undefined}
             */
            form.find('input.autocomplete').each(function () {
                var input = $(this),
                    data,

                    /**
                     *
                     * @type {jquery_ui_autocomplete_options}
                     */
                    options = input.data('autocomplete');

                if (options.multiple) {
                    data = /** Array */(options.source);

                    input.bind( 'keydown', function( event ) {
                        if ( event.keyCode === $.ui.keyCode.TAB &&
                                $( this ).data('ui-autocomplete').menu.active ) {
                            event.preventDefault();
                        }
                    });

                    $.extend(options, {
                        select: function ( event, ui ) {
                            var terms = split( this.value );
                            // remove the current input
                            terms.pop();
                            // add the selected item
                            terms.push( ui.item.value );
                            // add placeholder to get the comma-and-space at the end
                            terms.push( '' );
                            this.value = terms.join( ', ' );

                            return false;
                        },

                        /**
                         *
                         * @param {jquery_ui_autocomplete_request} request
                         * @param {Function} response
                         */
                        source: function ( request, response ) {
                            var terms = split(request.term),
                                term = terms.pop(),
                                filtered_data = data.filter(function (term) {
                                    return terms.indexOf(term) === -1;
                                });

                            response( $.ui.autocomplete.filter( filtered_data, term ) );
                        },

                        focus: function () {
                            return false;
                        }
                    });
                }

                input.autocomplete(options);
            });
        },

        /**
         * Fix buttons to bottom of page if their holder is out of screen.
         *
         * @return {undefined}
         */
        init_fly_form_actions: function () {
            var that = this,
                $window = $(window),
                holder = that.holder.find('.form-actions'),
                left_buttons = that.holder.find('.form-actions-left');

            function scroll () {
                var window_position = $window.scrollTop() + $window.height(),
                    form_actions_pos = holder.position().top;

                if (window_position < form_actions_pos) {
                    left_buttons.addClass('fly');
                } else {
                    left_buttons.removeClass('fly');
                }
            }

            if (that.holder.find('textarea').length > 0 &&
                holder.length > 0 && left_buttons.length > 0) {

                $window.on('scroll', scroll);
                that.on('destroy', function () {
                    $window.unbind('scroll', scroll);
                });

                scroll();
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
                that.holder = holder;
                that.init_locale_picker();
                that.init_inputs();
                that.init_upload();
                that.init_preview();
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
     * @param  {refinery.UserInterface} ui
     * @return {undefined}
     */
    refinery.admin.ui.form = function (holder, ui) {
        holder.find('form').each(function () {
            ui.addObject( refinery('admin.Form').init($(this)) );
        });
    };

}(refinery));
