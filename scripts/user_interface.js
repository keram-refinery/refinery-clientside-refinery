/*global $, refinery */

(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.Object}
     * @param {Object=} options
     * @return {refinery.UserInterface}
     */
    refinery.Object.create({
        objectConstructor: function () {
            this.objects = [];
            refinery.Object.apply(this, arguments);
        },

        name: 'UserInterface',

        options: {
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
         * @type {Object}
         */
        ui: refinery.ui,

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
                ui = this.ui,
                fnc;

            for (fnc in ui) {
                if (ui.hasOwnProperty(fnc) && typeof ui[fnc] === 'function') {
                    ui[fnc](holder, this);
                }
            }
        },

        /**
         * @expose
         * @return {undefined}
         */
        init_tabs: function () {
            this.holder.find('.ui-tabs').each(function () {
                var elm = $(this),
                    index = elm.find('.ui-tabs-nav .ui-state-active').index();

                elm.tabs({
                    'active': (index > -1 ? index : 0),
                    'activate': function (event, ui) {
                        ui.newPanel.find('input.text, textarea').first().focus();
                    }
                });
            });
        },

        /**
         * @expose
         * @return {undefined}
         */
        init_collapsible_lists: function () {
            this.holder.find('.collapsible-list').each(function () {
                var list = $(this),
                    options = /** Object */(list.data('ui-accordion-options'));

                list.accordion(options);
            });
        },

        /**
         * @expose
         * @return {undefined}
         */
        init_sortable: function () {
            this.holder.find('.sortable').each(function () {
                var list = $(this);

                list.sortable(list.data('ui-sortable-options'));
            });
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
         * @expose
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

            return this._destroy();
        },

        init: function (holder) {
            var that = this;

            if (that.is('initialisable')) {
                that.is('initialising', true);
                that.holder = holder;
                that.bind_events();

                that.init_sortable();
                that.init_tabs();
                that.init_checkboxes();
                that.init_collapsible_lists();
                that.init_toggle_hide();

                that.initialize_modules();
                that.is({'initialised': true, 'initialising': false});
                that.trigger('init');
            }

            return that;
        }
    });

}(refinery));
