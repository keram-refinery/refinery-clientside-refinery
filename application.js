// require jquery_ujs
// require turbolinks
// require jquery.ui.all
// require nestedsortables
// require i18n
//= require ./i18n/refinery-en
//= require ./i18n/refinery-admin-en
//= require ./refinery.min
//= require ./admin/admin.min

$(function () {
    'use strict';

    var doc = $(document),
        ui = new refinery.admin.UserInterface().init($('body'));

    function reload () {
        ui.reload($('body', false));
        refinery.spinner.off();
    }

    $.ajaxSettings.dataType = 'JSON';

    doc.on('page:fetch', function () {
        $('.ui-dialog').remove();
        refinery.spinner.on();
    });

    doc.on('page:load', reload);
    doc.on('page:restore', reload);

    window.addEventListener('popstate', function(event) {
        var state = event.state;
        if (state && state.refinery && state.url) {
            refinery.xhr.make(state.url);
        }
    }, false);

});
