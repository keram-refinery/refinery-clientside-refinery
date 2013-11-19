/*global $, refinery */

(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.Object}
     * @param {Object=} options
     * @return {refinery.UserInterface}
     */
    refinery.Object.create(
        /**
         * @extends {refinery.Object.prototype}
         */
        {
            name: 'UserInterface',

            options: {

                /**
                 * @expose
                 * @type {Object}
                 */
                ui_modules: refinery.ui,

                /**
                 * When Ajax request receive partial without id,
                 * content of holder.find(main_content_selector) will be replaced.
                 *
                 * @expose
                 * @type {!string}
                 */
                main_content_selector: '#content'
            },

            /**
             * @expose
             * @param  {refinery.Object} object
             * @return {Object} self
             */
            addObject: function (object) {
                this.objects.push(object);

                return this;
            },

            /**
             * Register standard ui events on holder
             *     - flash message close button
             *     - ajax response processing
             *
             * @return {undefined}
             */
            bind_events: function () {
                var that = this,
                    holder = that.holder;

                holder.on('click', '.flash-close', function (e) {
                    e.preventDefault();
                    $(this).parent().fadeOut();
                    return false;
                });

                /**
                 * Process ajax response
                 *
                 * @param  {jQuery.event} event
                 * @param  {json_response} response
                 * @param  {string} status
                 * @param  {jQuery.jqXHR} xhr
                 * @return {undefined}
                 */
                function ajax_success (event, response, status, xhr) {
                    var redirected_to = xhr.getResponseHeader('X-XHR-Redirected-To'),
                        replace_target = true,
                        target = event.target;

                    if (response.redirect_to) {
                        Turbolinks.visit(response.redirect_to);
                    } else {
                        if (redirected_to || target.tagName.toLowerCase() === 'a') {
                            target = holder.find(that.options.main_content_selector);
                            replace_target = false;
                        } else {
                            target = $(target);
                        }

                        that.destroy();
                        refinery.xhr.success(response, status, xhr, target, replace_target);
                        that.trigger('ui:change');
                    }
                }

                holder.on('ajax:success', ajax_success);

                holder.on('ajax:error',
                    /**
                     * @param {jQuery.event} event
                     * @param {jQuery.jqXHR} xhr
                     * @param {string} status
                     * @return {undefined}
                     */
                    function (event, xhr, status) {
                        refinery.xhr.error(xhr, status);
                    });

                holder.on('click', '.tree .toggle', function (e) {
                    e.preventDefault();
                    that.toggle_tree_branch($(this).parents('li:first'));
                });
            },

            toggle_tree_branch: function (li) {
                var elm = li.find('.toggle').first(),
                    nested = li.find('.nested').first();

                if (elm.hasClass('expanded')) {
                    elm.removeClass('expanded');
                    nested.slideUp();
                } else {

                    if (nested.hasClass('data-loaded')) {
                        elm.addClass('expanded');
                        nested.slideDown();
                    } else {
                        li.addClass('loading');
                        nested.load(nested.data('ajax-content'), function () {
                            elm.addClass('expanded');
                            nested.slideDown();
                            li.removeClass('loading');

                            if (nested.hasClass('data-cache')) {
                                nested.addClass('data-loaded');
                            }
                        });
                    }
                }
            },

            /**
             * Iterate through ui namespace and if found function,
             * call it with passed ui holder and self
             *
             * @expose
             * @return {undefined}
             */
            initialize_modules: function () {
                var holder = this.holder,
                    ui = this.options.ui_modules,
                    fnc;

                for (fnc in ui) {
                    if (ui.hasOwnProperty(fnc)) {
                        ui[fnc](holder, this);
                    }
                }
            },

            /**
             * @return {undefined}
             */
            init_jquery_ui_tabs: function () {
                this.holder.find('.ui-tabs').each(function () {
                    var elm = $(this),
                        nav_li = elm.find('.ui-tabs-nav li'),
                        index_stored = $.cookie('tab_' + elm.attr('id')),
                        index = elm.find('.ui-tabs-nav .ui-state-active').index();

                    if (index_stored && $(nav_li.get(index_stored)).is(':visible')) {
                        index = index_stored;
                    } else if (index === -1) {
                        index = elm.find('.ui-tabs-nav li:visible').first().index();
                    }

                    elm.tabs({
                        'active': index,
                        'activate': function (event, ui) {
                            $.cookie('tab_' + elm.attr('id'), ui.newTab.index(), {'path': '/'});

                            ui.newPanel.find('input.text, textarea').first().focus();
                        }
                    });
                });
            },

            /**
             * @return {undefined}
             */
            init_jquery_ui_widgets: function () {
                var holder = this.holder;

                $.each(['selectable', 'sortable', 'accordion'], function (key, val) {
                    holder.find('.ui-' + val).each(function () {
                        var list = $(this);

                        list[val](list.data('ui-' + val + '-options'));
                    });
                });

                this.init_jquery_ui_tabs();
            },

            init_checkboxes: function () {
                this.holder.find('div.checkboxes').each(function () {
                    var holder = $(this),
                        chboxs = holder.find('input:checkbox').not('[readonly]');

                    if (chboxs.length > 1) {
                        holder.find('.checkboxes-cmd.' +
                                ((chboxs.length === chboxs.filter(':checked').length) ? 'none' : 'all')
                        ).removeClass('hide');
                    }
                });

                this.holder.on('click', '.checkboxes-cmd', function (e) {
                    e.preventDefault();
                    var a = $(this),
                        parent = a.parent(),
                        checkboxes = parent.find('input:checkbox'),
                        checked = a.hasClass('all');

                    checkboxes.prop('checked', checked);
                    parent.find('.checkboxes-cmd').toggleClass('hide');
                });
            },

            /**
             * @return {undefined}
             */
            init_toggle_hide: function () {
                this.holder.on('click', '.toggle-hide', function () {
                    var elm = $(this);
                    $(elm.attr('href')).toggleClass('js-hide');
                    elm.toggleClass('toggle-on');
                });
            },

            /**
             * Destroy self and also all refinery, jquery ui instances under holder
             *
             * @return {Object} self
             */
            destroy: function () {
                if (this.is('initialised')) {
                    var o = this.objects.pop();

                    try {
                        while ( o ) {
                            o.destroy();
                            o = this.objects.pop();
                        }
                    } catch (e) {
                        refinery.log(e);
                        refinery.log(o, this.objects);
                    }
                }

                return this._destroy();
            },

            init: function (holder) {
                var that = this;

                if (that.is('initialisable')) {
                    that.is('initialising', true);
                    that.holder = holder;
                    this.objects = [];
                    that.bind_events();
                    that.init_jquery_ui_widgets();
                    that.init_checkboxes();
                    that.init_toggle_hide();

                    that.initialize_modules();
                    that.is({'initialised': true, 'initialising': false});
                    that.trigger('init');
                }

                return that;
            }
        });

}(refinery));
