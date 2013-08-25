/*global $, refinery */

(function (refinery) {

    'use strict';

   /**
     * refinery Object State
     *
     * @constructor
     * @extends {refinery.ObjectState}
     * @param {Object=} default_states
     *    Usage:
     *        new refinery.ObjectState();
     *
     * @todo  measure perf and if needed refactor to use bit masks, fsm or something else
     */
    function DialogState (default_states) {
        var states = $.extend(default_states || {}, {
            'closed' : true
        });

        refinery.ObjectState.call(this, states);
    }

    /**
     * Custom State Object prototype
     * @expose
     * @type {Object}
     */
    DialogState.prototype = {
        '_openable': function () {
            return (this.get('initialised') && this.get('closed') && !this.get('opening'));
        },
        '_closable': function () {
            return (!this.get('closing') && this.get('opened'));
        },
        '_loadable': function () {
            return (!this.get('loading') && !this.get('loaded'));
        },
        '_submittable': function () {
            return (this.get('initialised') && !this.get('submitting'));
        },
        '_insertable': function () {
            return (this.get('initialised') && !this.get('inserting'));
        }
    };

    refinery.extend(DialogState.prototype, refinery.ObjectState.prototype);


    /**
     * @constructor
     * @extends {refinery.Object}
     * @param {{title: string, url: string}=} options
     * @return {refinery.admin.Dialog}
     */
    refinery.Object.create(
        /**
         * @extends {refinery.Object.prototype}
         */
        {
            name: 'Dialog',

            module: 'admin',

            options: {
                'title': '',

                /**
                 * Url which from will be loaded dialog content via xhr or iframe
                 * @type {?string}
                 */
                'url': null,
                'width': 710,
                'modal': true,
                'autoOpen': false,
                'autoResize': true
            },

            /**
             * User Interface component
             *
             * @expose
             * @type {?refinery.Object}
             */
            ui: null,

            State: DialogState,

            /**
             *
             * @expose
             *
             * @return {Object} self
             */
            close: function () {
                if (this.is('closable')) {
                    this.holder.dialog('close');
                }

                return this;
            },

            /**
             *
             * @expose
             *
             * @return {Object} self
             */
            open: function () {
                if (this.is('openable')) {
                    this.is('opening', true);
                    this.holder.dialog('open');
                }

                return this;
            },

            /**
             *
             * @expose
             *
             * @return {Object} self
             */
            submit: function () {
                var form = this.holder.find('form');

                form.submit();

                return this;
            },

            /**
             * Submit form
             * -- just dirty implementation
             * Implement for specific cases in subclasses
             *
             *
             * @expose
             * @param {jQuery} form
             *
             * @return {undefined}
             */
            submit_form: function (form) {
                var that = this;

                if (that.is('submittable')) {
                    that.is('submitting', true);

                    $.ajax({
                        url: form.attr('action'),
                        type: form.attr('method'),
                        data: form.serialize(),
                        dataType: 'JSON'
                    }).done(function (response, status, xhr) {
                        that.xhr_done(response, status, xhr);

                        that.trigger('submit');
                    }).always(function () {
                        that.is({'submitted': true, 'submitting': false});
                    });
                }
            },

            /**
             * Handle Insert event
             * For specific use should be implemented in subclasses
             *
             * @expose
             * @param {?jQuery} elm
             *
             * @return {Object} self
             */
            insert: function (elm) {
                var tab, obj, fnc;

                if (elm.length > 0) {
                    tab = elm.closest('.ui-tabs-panel');

                    if (tab.length > 0) {
                        fnc = tab.attr('id').replace(/-/g, '_');
                        if (typeof this[fnc] === 'function') {
                            obj = this[fnc](tab);
                        }
                    }
                }

                if (obj) {
                    this.trigger('insert', obj);
                }

                return this;
            },

            /**
             * Bind events to dialog buttons and forms
             *
             * @return {undefined}
             */
            init_buttons: function () {
                var that = this,
                    holder = that.holder;

                holder.on('click', '.cancel-button, .close-button', function (e) {
                    e.preventDefault();
                    that.close();
                    return false;
                });

                holder.on('submit', 'form', function (e) {
                    var form = $(this);

                    e.preventDefault();
                    e.stopPropagation();

                    if (form.attr('action')) {
                        that.submit_form(form);
                    } else {
                        that.insert(form);
                    }

                    return false;
                });
            },

            /**
             * Process xhr response and reloading ui interface
             *
             * @expose
             *
             * @param  {json_response} response
             * @param  {string} status
             * @param  {jQuery.jqXHR} xhr
             *
             * @return {undefined}
             */
            xhr_done: function (response, status, xhr) {
                var that = this,
                    ui = that.ui,
                    holder = ui.holder;

                refinery.xhr.success(response, status, xhr, holder);
                ui.reload(holder);
            },

            /**
             * Xhr fail processing
             *
             * @expose
             *
             * @param  {jQuery.jqXHR} xhr
             * @param  {string} status
             *
             * @return {undefined}
             */
            xhr_fail: function (xhr, status) {
                refinery.xhr.error(xhr, status);
            },

            init_paginate: function () {
                var that = this,
                    holder = that.holder;

                holder.on('click', '.pagination > a', function (e) {
                    e.preventDefault();
                    $.ajax({
                        url: this.getAttribute('href'),
                        dataType: 'JSON'
                    })
                    .fail(refinery.xhr.error)
                    .done(function (response, status, xhr) {
                        that.xhr_done(response, status, xhr);
                    });
                });
            },

            /** @expose */
            after_load: function () {
            },

            /**
             * Load dialog content
             *
             * @expose
             * @todo this is (still) ugly, refactor!
             *
             * @return {Object} self
             */
            load: function () {
                var that = this,
                    holder = that.holder,
                    url = that.options.url,
                    locale_input = $('#frontend_locale'),
                    params, xhr;

                if (!url) {
                    throw new Error('Url isn\'t defined. (' + that.uid + ')');
                }

                if (that.is('loadable')) {
                    that.is('loading', true);

                    params = {
                        'id': that.id,
                        'frontend_locale': locale_input.length > 0 ? locale_input.val() : 'en'
                    };

                    xhr = $.ajax(url, params);

                    xhr.fail(function () {
                        // todo xhr, status
                        holder.html($('<div/>', {
                            'class': 'flash error',
                            'html': t('refinery.admin.dialog_content_load_fail')
                        }));

                        /**
                         * Propagate that load finished unsuccessfully
                         */
                        that.trigger('load', false);
                    });

                    xhr.always(function () {
                        that.is('loading', false);
                        holder.removeClass('loading');
                    });

                    xhr.done(function (response, status, xhr) {
                        var ui_holder;

                        if (status === 'success') {
                            holder.empty();
                            ui_holder = $('<div/>').appendTo(holder);
                            refinery.xhr.success(response, status, xhr, ui_holder);
                            that.ui.init(ui_holder);
                            that.is('loaded', true);
                            that.after_load();

                            /**
                             * Propagate that load finished successfully
                             */
                            that.trigger('load', true);
                        }
                    });

                }

                return this;
            },

            bind_events: function () {
                var that = this,
                    holder = that.holder;

                that.on('insert', that.close);
                that.on('open', that.load);

                holder.on('dialogopen', function () {
                    that.is({ 'opening': false, 'opened': true, 'closed': false });
                    that.trigger('open');
                });

                holder.on('dialogbeforeclose', function () {
                    // this is here because dialog can be closed via ESC or X button
                    // and in that case is not running through that.close
                    // @todo maybe purge own close - open methods
                    that.is({ 'closing': false, 'closed': true, 'opened': false });
                    that.trigger('close');
                });

                holder.on('selectableselected', '.records.ui-selectable', function (event, ui) {
                    that.insert($(ui.selected));
                });
            },

            /**
             *
             * @expose
             * @param {boolean=} removeGlobalReference if is true instance will be removed
             *                   from refinery.Object.instances
             *
             * @return {Object} self
             */
            destroy: function (removeGlobalReference) {
                if (this.ui) {
                    this.ui.destroy(true);
                    this.ui = null;
                }

                if (this.holder && this.holder.parent().hasClass('ui-dialog')) {
                    this.holder.dialog('destroy');
                }

                this._destroy(removeGlobalReference);

                return this;
            },

            /**
             * Initialization and binding
             *
             * @public
             * @expose
             *
             * @return {refinery.Object} self
             */
            init: function () {
                var holder;

                if (this.is('initialisable')) {
                    this.is('initialising', true);
                    holder = $('<div/>', {
                        'id': 'dialog-' + this.id,
                        'class': 'loading'
                    });

                    holder.dialog(this.options);
                    this.attach_holder(holder);

                    this.ui = refinery('admin.UserInterface', {
                        'main_content_id': 'dialog-' + this.id
                    });

                    this.bind_events();
                    this.init_buttons();
                    this.init_paginate();
                    this.is({'initialised': true, 'initialising': false});
                    this.trigger('init');
                }

                return this;
            }
        });

}(refinery));
