/*global $, refinery */

(function (refinery) {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.Object}
     * @param {Object=} options
     * @return {refinery.admin.UserInterface}
     */
    refinery.Object.create({

        name: 'UserInterface',

        module: 'admin',

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

        init_collapsible_lists: function () {
            this.holder.find('.collapsible-list').accordion({
                collapsible: true,
                heightStyle: 'content'
            });
        },

        init_sortable: function () {
            this.holder.find('.sortable-list').each(function () {
                var list = $(this),
                    options = list.data('sortable-options');

                if (list.hasClass('records')) {
                    if (list.hasClass('tree')) {
                        refinery('admin.SortableTree', options).init(list);
                    } else {
                        refinery('admin.SortableList', options).init(list);
                    }
                } else {
                    list.sortable(options);
                }
            });
        },

        init_deletable_records: function () {
            var holder = this.holder;

            function hideRecord (elm) {
                var record = elm.closest('.record');
                record = record.length > 0 ? record : holder.find('.record');
                record = record.length > 0 ? record : elm.closest('li');

                if (record.length > 0) {
                    record.fadeOut('normal', function () {
                        record.remove();
                    });
                }
            }

            holder.on('confirm:complete', '.records .delete', function (event, answer) {
                if (answer) {
                    hideRecord($(this));
                }
            });

            holder.on('click', 'a.delete', function () {
                if (!this.hasAttribute('data-confirm')) {
                    hideRecord($(this));
                }
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

        bind_events: function () {
            var that = this,
                holder = that.holder;

            holder.on('click', '.flash-close', function (e) {
                e.preventDefault();
                $(this).parent().fadeOut();
                return false;
            });

            holder.on('click', '.tree .toggle', function (e) {
                e.preventDefault();
                that.toggle_tree_branch($(this).parents('li:first'));
            });

            holder.on('ajax:success', function (event, response, status, xhr) {
                if (response && typeof response === 'object') {
                    event.preventDefault();

                    if (response.redirect_to) {
                        Turbolinks.visit(response.redirect_to);
                    } else {
                        that.destroy(false);
                        refinery.xhr.success(response, status, xhr, $(event.target), true);
                        that.reload(holder);
                    }
                }
            });

            holder.on('ajax:error', function (event, xhr, status) {
                refinery.xhr.error(xhr, status);
            });

            holder.find('.ui-selectable').selectable({ 'filter': 'li' });
        },

        init_toggle_hide: function () {
            this.holder.on('click', '.toggle-hide', function () {
                var elm = $(this);
                $(elm.attr('href')).toggleClass('js-hide');
                elm.toggleClass('toggle-on');
            });
        },

        initialize_elements: function () {
            var that = this,
                holder = that.holder,
                ui = refinery.admin.ui,
                fnc;

            that.init_sortable();
            that.init_tabs();
            that.init_checkboxes();
            that.init_collapsible_lists();
            that.init_toggle_hide();

            that.init_deletable_records();

            for (fnc in ui) {
                if (ui.hasOwnProperty(fnc) && typeof ui[fnc] === 'function') {
                    ui[fnc](holder, that);
                }
            }

            holder.find('input.text, textarea').first().focus();
        },

        /**
         * Removing all refinery instances under holder, and reloading self.
         * This is important when ajax replace current content of holder so, some objects
         * may not longer exist and we need remove all references to them.
         *
         * @param {jQuery} holder
         *
         * @return {Object} self
         */
        reload: function (holder) {
            holder = holder || this.holder;
            this.destroy(false);
            this.state = new this.State();
            return this.init(holder);
        },

        /**
         * Destroy self and also all refinery, jquery ui instances under holder
         *
         * @param {boolean=} removeGlobalReference if is true instance will be removed
         *                   from refinery.Object.instances
         *
         * @return {Object} self
         */
        destroy: function (removeGlobalReference) {
            var holder = this.holder,
                holders;

            if (holder) {
                holders = holder.find('.refinery-instance');

                try {
                    holders.each(function () {
                        var instances = $(this).data('refinery-instances'),
                            instance;

                        for (var i = instances.length - 1; i >= 0; i--) {
                            instance = refinery.Object.instances.get(instances[i]);
                            instance.destroy(true);
                        }
                    });
                } catch (e) {
                    if (typeof console === 'object' && typeof console.log === 'function') {
                        console.log(e);
                    }
                }

                // we can't do this because destroying jquery ui instances a
                // also removes classes on objects which we use
                //
                // try {
                //     holder.find('.collapsible-list').accordion('destroy');
                //     holder.find('.ui-tabs').tabs('destroy');
                //     holder.find('.ui-selectable').selectable('destroy');
                //     holder.find('.sortable-list').not('.records').sortable('destroy');
                // } catch (e) {
                //     console.log(e);
                // }
            }

            this._destroy(removeGlobalReference);

            return this;
        },

        init: function (holder) {
            var that = this;

            if (that.is('initialisable')) {
                that.is('initialising', true);
                that.attach_holder(holder);
                that.bind_events();
                that.initialize_elements();
                that.is({'initialised': true, 'initialising': false});
                that.trigger('init');
            }

            return that;
        }
    });

}(refinery));
