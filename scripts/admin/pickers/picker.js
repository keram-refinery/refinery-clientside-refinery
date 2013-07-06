(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.Object}
     * @param {Object=} options
     */
    refinery.Object.create({
        name: 'Picker',

        module: 'admin',

        /**
         *
         * @type {?string}
         */
        elm_current_record_id: null,

        /**
         *
         * @type {?(jQuerySelector|jQuery)}
         */
        elm_record_holder: null,

        /**
         *
         * @type {?(jQuerySelector|jQuery)}
         */
        elm_no_picked_record: null,

        /**
         *
         * @type {?(jQuerySelector|jQuery)}
         */
        elm_remove_picked_record: null,

        /**
         * refinery admin dialog
         *
         * @expose
         *
         * @type {?refinery.Object}
         */
        dialog: null,

        /**
         * Open dialog
         *
         * @expose
         *
         * @return {undefined}
         */
        open: function () {
            this.dialog.open();
        },

        /**
         * Close dialog
         *
         * @expose
         *
         * @return {undefined}
         */
        close: function () {
            this.dialog.close();
        },

        /**
         * Insert record to form
         *
         * @param {{id: (string|number)}} record
         * @expose
         *
         * @return {undefined}
         */
        insert: function (record) {
            console.log(record);
        },

        /**
         * Bind events
         *
         * @protected
         * @expose
         *
         * @return {undefined}
         */
        bind_events: function () {
            var that = this,
                holder = this.holder;

            that.dialog.on('insert', function (record) {
                that.insert(record);
            });

            holder.find('.current-record-link').on('click', function (e) {
                e.preventDefault();
                that.open();
            });

            holder.find('.remove-picked-record').on('click', function (e) {
                e.preventDefault();
                that.elm_current_record_id.val('');
                that.elm_record_holder.empty();
                that.elm_remove_picked_record.addClass('hide');
                that.elm_no_picked_record.removeClass('hide');
                that.trigger('remove');
            });
        },

        /**
         * Initialization and binding
         *
         * @param {!jQuery} holder
         * @param {!refinery.Object} dialog
         *
         * @return {refinery.Object}
         */
        init: function (holder, dialog) {
            if (this.is('initialisable')) {
                this.is('initialising', true);
                this.holder = holder;
                this.elm_current_record_id = holder.find('.current-record-id');
                this.elm_record_holder = holder.find('.record-holder');
                this.elm_no_picked_record = holder.find('.no-picked-record-selected');
                this.elm_remove_picked_record = holder.find('.remove-picked-record');
                this.dialog = dialog.init(holder);
                this.bind_events();
                this.is({'initialised': true, 'initialising': false});
                this.is({'initialising' : false, 'initialised': true });
                this.trigger('init');
            }

            return this;
        }
    });

}());
