(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({

            objectPrototype: refinery('admin.Dialog', {
                title: t('refinery.admin.images_dialog_title'),
                url: '/refinery/dialogs/images'
            }, true),

            name: 'ImagesDialog',

            /**
             * Select first image in library
             * Put focus to first text input element
             *
             * @return {undefined}
             */
            after_load: function () {
                var that = this,
                    holder = that.holder;

                holder.on('selectableselected', '.ui-selectable', function (event, ui) {
                    that.library_tab($(ui.selected));
                });

                holder.on('submit', '#external-image-area form', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    that.url_tab($(this));
                });

                holder.on('ajax:success', function (xhr, response) {
                    that.upload_tab(response.image);
                });
            },

            /**
             * Handle image linked from library
             *
             * @param {jQuery} li
             * @return {Object} self
             */
            library_tab: function (li) {
                var /** @typedef {{id: string}} */ obj;

                if (li.length > 0) {
                    obj = {
                        id: li.attr('id').match(/[0-9]+$/)[0]
                    };

                    li.removeClass('ui-selected');
                    this.trigger('insert', obj);
                }

                return this;
            },

            /**
             * Handle image linked by url
             *
             * @param {jQuery} form
             * @return {Object} self
             */
            url_tab: function (form) {
                var url_input = form.find('input[type="url"]:valid'),
                    alt_input = form.find('input[type="text"]:valid'),
                    url = /** @type {string} */(url_input.val()),
                    alt = /** @type {string} */(alt_input.val()),
                    /** @typedef {{alt: string, url: string}} */
                    obj;

                if (url) {
                    obj = {
                        url: url,
                        alt: alt
                    };

                    url_input.val('');
                    alt_input.val('');
                    this.trigger('insert', obj);
                }

                return this;
            },

            /**
             * Handle uploaded image
             *
             * @param {Object} image
             * @return {Object} self
             */
            upload_tab: function (image) {
                var that = this,
                    holder = that.holder;

                if (image) {
                    that.trigger('insert', image);
                    holder.find('li.ui-selected').removeClass('ui-selected');
                    holder.find('.ui-tabs').tabs({ 'active': 0 });
                }

                return that;
            },

            /**
             * Propagate selected image wth attributes to dialog observers
             *
             * @return {Object} self
             */
            insert: function () {
                return this;
            }
        });

}());
