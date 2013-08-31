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
        },

        /**
         * Iterate through refinery.ui namespace
         * and if found function, call with passed ui holder and self
         *
         * @return {undefined}
         */
        initialize_elements: function () {
            var that = this,
                holder = that.holder,
                ui = refinery.ui,
                fnc;

            for (fnc in ui) {
                if (ui.hasOwnProperty(fnc) && typeof ui[fnc] === 'function') {
                    ui[fnc](holder, that);
                }
            }
        },

        /**
         * Destroy self and also all refinery, jquery ui instances under holder
         *
         * @return {Object} self
         */
        destroy: function () {
            var holder = this.holder,
                holders;

            if (holder) {
                holders = /** array */(holder.find('.refinery-instance'));

                try {
                    holders.each(function () {
                        var instances = $(this).data('refinery-instances'),
                            instance;

                        for (var i = instances.length - 1; i >= 0; i--) {
                            instance = refinery.Object.instances.get(instances[i]);
                            instance.destroy();
                        }
                    });
                } catch (e) {
                    if (typeof console === 'object' && typeof console.log === 'function') {
                        console.log(e);
                    }
                }
            }

            return this._destroy();
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
