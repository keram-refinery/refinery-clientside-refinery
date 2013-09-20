
(function (refinery) {

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
         * @expose
         * @type {?string}
         */
        elm_current_record_id: null,

        /**
         * @expose
         * @type {jQuery}
         */
        elm_record_holder: null,

        /**
         * @expose
         * @type {jQuery}
         */
        elm_no_picked_record: null,

        /**
         * @expose
         * @type {jQuery}
         */
        elm_remove_picked_record: null,

        /**
         * refinery admin dialog
         *
         * @expose
         *
         * @type {?refinery.admin.Dialog}
         */
        dialog: null,

        /**
         * Open dialog
         *
         * @expose
         *
         * @return {Object} self
         */
        open: function () {
            this.getDialog().open();
            return this;
        },

        /**
         * Close dialog
         *
         * @expose
         *
         * @return {Object} self
         */
        close: function () {
            this.getDialog().close();
            return this;
        },

        /**
         * Insert record to form
         *
         * @param {{id: (string|number)}} record
         * @expose
         *
         * @return {Object} self
         */
        insert: function (record) {
            refinery.log(record);
            return this;
        },

        /**
         *
         * @expose
         * @return {Object} self
         */
        destroy: function () {
            if (this.dialog) {
                this.dialog.destroy();
            }

            return this._destroy();
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
                holder = that.holder;

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
         * Abstract method
         *
         * abstract
         * @expose
         */
        init_dialog: function () { },

        /**
         * Returns dialog, if it doesn't exists yet, create one.
         *
         * @expose
         * @return {refinery.admin.Dialog}
         */
        getDialog: function () {
            return (this.dialog ? this.dialog : this.init_dialog());
        },

        /**
         * Initialization and binding
         *
         * @param {!jQuery} holder
         *
         * @return {refinery.Object} self
         */
        init: function (holder) {
            if (this.is('initialisable')) {
                this.is('initialising', true);
                this.attach_holder(holder);
                this.elm_current_record_id = holder.find('.current-record-id');
                this.elm_record_holder = holder.find('.record-holder');
                this.elm_no_picked_record = holder.find('.no-picked-record-selected');
                this.elm_remove_picked_record = holder.find('.remove-picked-record');
                this.bind_events();
                this.is({ 'initialised': true, 'initialising': false });
                this.trigger('init');
            }

            return this;
        }
    });

}(refinery));
