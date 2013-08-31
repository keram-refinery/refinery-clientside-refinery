function uiSelect (item) {
    $(item).addClass('ui-selected')
        .trigger('selectableselected', {
            selected: item
        });
}

function errorResponse (data) {
    var d;

    data = data || {};
    d = $.Deferred();

    d.reject(data, 404, 'something went wrong');
    return d.promise();
};

function okResponse (data) {
    var d;

    data = data || {};
    d = $.Deferred();

    d.resolve(data, 'success', {
      getResponseHeader: function (args) {
        return false;
      }
    });

    return d.promise();
};
