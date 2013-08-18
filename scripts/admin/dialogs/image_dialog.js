(function () {

    'use strict';

    /**
     * @constructor
     * @extends {refinery.admin.Dialog}
     * @param {Object=} options
     */
    refinery.Object.create({

            objectPrototype: refinery('admin.Dialog', {
                title: t('refinery.admin.image_dialog_title')
            }, true),

            name: 'ImageDialog',

            /**
             * Propagate selected image wth attributes to dialog observers
             *
             * @return {Object} self
             */
            insert: function () {
                var holder = this.holder,
                    alt = holder.find('#image-alt').val(),
                    id = holder.find('#image-id').val(),
                    size_elm = holder.find('#image-size .ui-selected a'),
                    size = size_elm.data('size'),
                    geometry = size_elm.data('geometry'),
                    sizes = holder.find('#image-preview').data(),
                    obj;

                obj = {
                    'id': id,
                    'alt': alt,
                    'size': size,
                    'geometry': geometry,
                    'sizes': sizes
                };

                this.trigger('insert', obj);

                return this;
            }
        });

}());
