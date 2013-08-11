(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.Object}
     * @param {Object=} options
     */
    refinery.Object.create({

        name: 'FormPageParts',

        module: 'admin',

        /**
         * Create list of page parts for dialog
         *
         * @return {string} dialog content
         */
        get_dialog_content: function () {
            var content;

            content = '<ul class="records">';

            this.nav.find('a').each(function () {
                var a = $(this),
                    active = !a.parent().hasClass('js-hide');

                content += '<li data-part="' + a.attr('href') + '" ';
                content += 'class="clearfix" >';
                content += '<label class="stripped">';
                content += '<input type="checkbox"' + (active ? ' checked="1"' : '') + '"> ';
                content += a.text();
                content += '</label>';
                content += ' <span class="actions"><span class="icon-small move-icon">';
                content += t('refinery.admin.button_move') + '</span></span>';
                content += '</li>';
            });

            content += '</ul>';

            return content;
        },

        /**
         * Initialize page part dialog and bind events
         *
         * @return {undefined}
         */
        init_configuration_dialog: function () {
            var that = this,
                holder = that.holder,
                nav = that.nav,
                dialog_holder,
                dialog_buttons = {},
                parts_tabs = nav.find('li');

            dialog_holder = $('<div/>', {
                html: that.get_dialog_content()
            });

            function update_parts () {
                var list = [], i, l, active_tab;

                dialog_holder.find('li').each(function (j) {
                    var li = $(this),
                        part = /** @type string */(li.data('part')),
                        active = li.find('input').is(':checked'),
                        tab = nav.find('a[href="' + part + '"]').parent().detach(),
                        panel = $(part);

                    if (active) {
                        tab.removeClass('js-hide');
                        panel.removeClass('js-hide');
                    } else {
                        tab.removeClass('ui-tabs-active ui-state-active');
                        tab.addClass('js-hide');
                        panel.addClass('js-hide');
                    }

                    panel.find('input.part-active').prop('checked', active);
                    panel.find('input.part-position').val(j);
                    list[list.length] = tab;
                });

                for (i = 0, l = list.length; i < l; i++) {
                    nav.append(list[i]);
                }

                if (nav.find('.ui-tabs-active').length === 0) {
                    active_tab = parts_tabs.index(nav.find('li:visible').first());

                    holder.tabs({
                        'active': active_tab
                    });
                }
            }

            dialog_holder.on('change', 'li input', update_parts);

            dialog_holder.find('ul').sortable({
                'stop': update_parts
            });

            dialog_buttons[t('refinery.admin.button_done')] = function () {
                update_parts();
                dialog_holder.dialog('close');
            };

            dialog_holder.dialog({
                'title': t('refinery.admin.form_page_parts_manage'),
                'modal': true,
                'resizable': true,
                'autoOpen': false,
                'width': 400,
                'buttons': dialog_buttons
            });

            holder.on('click', '#page-parts-options', function (e) {
                e.preventDefault();
                dialog_holder.dialog('open');
            });

            that.dialog_holder = dialog_holder;
        },

        /**
         *
         * @param {boolean=} removeGlobalReference if is true instance will be removed
         *                   from refinery.Object.instances
         *
         * @return {Object} self
         */
        destroy: function (removeGlobalReference) {
            if (this.is('initialised')) {
                this.nav = null;

                if (this.dialog_holder) {
                    if (this.dialog_holder.hasClass('ui-dialog')) {
                        this.dialog_holder.dialog('destroy');
                    }

                    this.dialog_holder.off();
                    this.dialog_holder.remove();
                    this.dialog_holder = null;
                }
            }

            this._destroy(removeGlobalReference);

            return this;
        },

        /**
         * initialisation
         *
         * @param {!jQuery} holder
         *
         * @return {Object} self
         */
        init: function (holder) {
            if (this.is('initialisable')) {
                this.is('initialising', true);
                this.attach_holder(holder);
                this.nav = holder.find('.ui-tabs-nav');
                this.init_configuration_dialog();
                this.is({'initialised': true, 'initialising': false});
                this.trigger('init');
            }

            return this;
        }
    });

    /**
     * Form initialization
     *
     * @expose
     * @param  {jQuery} holder
     * @return {undefined}
     */
    refinery.admin.ui.formPageParts = function (holder) {
        holder.find('#page-parts').each(function () {
            refinery('admin.FormPageParts').init($(this));
        });
    };

}());
