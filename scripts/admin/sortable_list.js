/*global $, refinery */

(function (refinery) {

    'use strict';

    /**
     * Sortable List
     *
     * @expose
     * @todo  refactor that SortableTree constructor and SortableList would be the same
     * @extends {refinery.Object}
     * @param {Object=} options
     * @param {boolean=} is_prototype
     */
    refinery.Object.create({

        /**
         * Configurable options
         *
         * @param {{nested_sortable: Object}} options
         */
        objectConstructor: function (options, is_prototype) {
            var that = this;

            refinery.Object.apply(that, arguments);

            if (!is_prototype) {

                /**
                 *
                 * @expose
                 * @param {*} event
                 * @param {*} ui
                 *
                 * @return {undefined}
                 */
                that.options.nested_sortable.stop = function (event, ui) {
                    that.update(ui.item);
                };
            }
        },

        name: 'SortableList',

        module: 'admin',

        /**
         * Configurable options
         *
         * @type {Object}
         */
        options: {
            /**
             * @expose
             * @type {{items: string, listType: string, maxLevels: number}}
             */
            nested_sortable: {
                listType: 'ul',
                items: 'li',
                maxLevels: 1
            }
        },

        /**
         * Serialized array of items
         *
         * @type {?Array}
         */
        set: null,

        /**
         * Html content of list holder
         *
         * @type {?string}
         */
        html: null,

        /**
         * Get Item id
         *
         * @param {!jQuery} item
         *
         * @return {?string}
         */
        getId: function (item) {
            if (item.attr('id') && /([0-9]+)$/.test(item.attr('id'))) {
                return item.attr('id').match(/([0-9]+)$/)[1];
            }

            return null;
        },

        /**
         * Update item position on server
         *
         * @expose
         * @param {jQuery} item
         *
         * @return {Object} self
         */
        update: function (item) {
            var that = this,
                list = that.holder,
                getId = that.getId,
                update_url = list.data('update_positions_url'),
                set = list.nestedSortable('toArray'),
                post_data = {
                    'item': {
                        'id': getId(item),
                        'prev_id': getId(item.prev()),
                        'next_id': getId(item.next()),
                        'parent_id': getId(item.parent().parent())
                    }
                };

            if (!that.is('updating') && that.serialize_set(set) !== that.serialized_set) {
                that.is({'updating': true, 'updated': false});
                list.nestedSortable('disable');
                refinery.spinner.on();

                $.post(update_url, post_data, null, 'JSON')
                    .done(function (response, status, xhr) {
                        if (status === 'error') {
                            that.restore_list();
                        } else {
                            that.store_list(set);
                        }

                        refinery.xhr.success(response, xhr, list);

                        that.is('updated', true);
                        that.trigger('update');
                    })
                    .fail(function (response) {
                        list.html(that.html);
                        refinery.xhr.error(response);
                    })
                    .always(function () {
                        refinery.spinner.off();
                        that.is('updating', false);
                        list.nestedSortable('enable');
                    });
            }

            return that;
        },

        serialize_set: function (set) {
            return JSON.stringify(set);
        },

        restore_list: function () {
            this.list.html(this.html);
        },

        store_list: function (set) {
            this.serialized_set = this.serialize_set(set);
            this.html = this.holder.html();
        },

        destroy: function () {
            this.holder.nestedSortable('destroy');
            this.serialized_set = null;

            return this._destroy();
        },

        init: function (holder) {
            if (this.is('initialisable')) {
                this.is('initialising', true);

                holder.nestedSortable(this.options.nested_sortable);
                this.holder = holder;
                this.store_list(holder.nestedSortable('toArray'));
                this.is({'initialised': true, 'initialising': false});
                this.trigger('init');
            }

            return this;
        }
    });


    /**
     * Sortable list initialization
     *
     * @expose
     * @param  {jQuery} holder
     * @param  {refinery.UserInterface} ui
     * @return {undefined}
     */
    refinery.admin.ui.sortableList = function (holder, ui) {
        holder.find('.sortable-list').each(function () {
            ui.addObject(
                refinery('admin.SortableList').init($(this))
            );
        });
    };

}(refinery));
