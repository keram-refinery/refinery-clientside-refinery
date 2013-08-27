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
             * Handle Insert event
             * For specific use should be implemented in subclasses
             *
             * @expose
             * @param {!jQuery} elm Element which evoke insert event
             *
             * @return {Object} self
             */
            insert: function (elm) {
                var tab = elm.closest('.ui-tabs-panel'),
                    obj, fnc;

                if (tab.length > 0) {
                    fnc = tab.attr('id').replace(/-/g, '_');
                    if (typeof this[fnc] === 'function') {
                        obj = this[fnc](elm);
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
             * @expose
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

                    if (!form.attr('action')) {
                        e.preventDefault();
                        e.stopPropagation();
                        that.insert(form);
                    }
                });
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
                    });

                    xhr.done(function (response, status, xhr) {
                        if (status === 'success') {
                            holder.empty();
                            that.ui_holder = $('<div/>').appendTo(holder);
                            refinery.xhr.success(response, status, xhr, that.ui_holder);
                            that.ui_change();
                            that.is('loaded', true);
                        }
                    });

                    xhr.always(function () {
                        that.is('loading', false);
                        holder.removeClass('loading');
                        that.trigger('load');
                    });
                }

                return this;
            },

            ui_change: function () {
                var that = this;

                function ui_change () {
                    if (that.ui) {
                        that.ui.destroy();
                        that.ui.unsubscribe('ui:change', ui_change);
                    }

                    that.ui = refinery('admin.UserInterface', {
                        'main_content_selector': '.dialog-content-wrapper'
                    }).init(that.ui_holder);

                    that.ui.subscribe('ui:change', ui_change);
                }

                ui_change();
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

                holder.on('click', '.pagination a', function (event) {
                    var a = $(this),
                        url = /** @type {string} */(a.attr('href'));

                    event.preventDefault();
                    event.stopPropagation();

                    $.get(url).done(
                        /**
                         * @param {json_response} response
                         * @param {string} status
                         * @param {jQuery.jqXHR} xhr
                         * @return {undefined}
                         */
                        function (response, status, xhr) {
                            holder.find('.dialog-content-wrapper')
                            .trigger('ajax:success', [response, status, xhr]);
                        }).always(function () {
                            refinery.spinner.off();
                        });
                });

                holder.on('ajax:success',
                    /**
                     *
                     * @param  {jQuery.jqXHR} xhr
                     * @param  {json_response} response
                     * @return {undefined}
                     */
                    function (xhr, response) {
                        that.upload_area(response);
                    });
            },

            /**
             * Handle uploaded resource
             *
             * @expose
             * @return {undefined}
             */
            upload_area: function () { },

            /**
             *
             * @expose
             * @return {Object} self
             */
            destroy: function () {
                if (this.ui) {
                    this.ui.destroy();
                    this.ui.unsubscribe('ui:change', this.ui_change);
                    this.ui = null;
                }

                if (this.holder && this.holder.parent().hasClass('ui-dialog')) {
                    this.holder.dialog('destroy');
                }

                return this._destroy();
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

                    this.bind_events();
                    this.init_buttons();

                    this.is({'initialised': true, 'initialising': false});
                    this.trigger('init');
                }

                return this;
            }
        });

}(refinery));
