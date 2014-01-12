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
                update_url = list.data('update_positions_url'),
                set = list.nestedSortable('toArray'),
                post_data = {
                    'item': {
                        'id': that.getId(item),
                        'prev_id': that.getId(item.prev()),
                        'next_id': that.getId(item.next()),
                        'parent_id': that.getId(item.parent().parent())
                    }
                };

            if (!that.is('updating') && JSON.stringify(set) !== JSON.stringify(that.set)) {
                that.is({'updating': true, 'updated': false});
                list.nestedSortable('disable');
                refinery.spinner.on();

                $.post(update_url, post_data, function (response, status, xhr) {
                    if (status === 'error') {
                        list.html(that.html);
                    } else {
                        that.set = set;
                        that.html = list.html();
                    }

                    refinery.xhr.success(
                        response,
                        list,
                        xhr.getResponseHeader('X-XHR-Redirected-To'));
                    that.is('updated', true);
                    that.trigger('update');
                }, 'JSON')
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

        destroy: function () {
            this.holder.nestedSortable('destroy');
            this.set = null;

            return this._destroy();
        },

        init: function (holder) {
            if (this.is('initialisable')) {
                this.is('initialising', true);

                holder.nestedSortable(this.options.nested_sortable);
                this.holder = holder;
                this.set = holder.nestedSortable('toArray');
                this.html = holder.html();
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
