function uiSelect(item) {
  $(item).addClass("ui-selected")
    .trigger('selectableselected', {
      selected: item
    });
}
