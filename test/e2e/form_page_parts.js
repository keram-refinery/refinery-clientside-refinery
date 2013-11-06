(function() {
  describe('PageParts', function() {
    before(function(done) {
      var container, ui;
      container = $('#container');
      ui = new refinery.UserInterface({
        ui_modules: refinery.admin.ui
      });
      $.get('/test/fixtures/page_new_parts_default.html', function(response) {
        container.html(response);
        ui.init(container);
        return done();
      });
      this.ui = ui;
      return this.container = container;
    });
    after(function() {});
    describe('activate part', function() {
      before(function() {
        $('#page-parts-options').click();
        $('.ui-dialog li[data-part="perex"] label').first().click();
        return $('.ui-dialog .ui-dialog-buttonset button').click();
      });
      after(function(done) {
        return done();
      });
      return it('show perex tab', function() {
        return expect($('.ui-tabs-nav li[aria-controls="page_part_perex"]').hasClass('js-hide')).to.be["false"];
      });
    });
    describe('deactivate part', function() {
      before(function() {
        $('#page-parts-options').click();
        $('.ui-dialog li[data-part="body"] label').first().click();
        return $('.ui-dialog .ui-dialog-buttonset button').click();
      });
      after(function() {
        $('#page-parts-options').click();
        $('.ui-dialog li label').get(1).click();
        return $('.ui-dialog .ui-dialog-buttonset button').click();
      });
      it('hide body tab', function() {
        return expect($('.ui-tabs-nav li[aria-controls="page_part_body"]').hasClass('js-hide')).to.be["true"];
      });
      return it('activate another tab', function() {
        return expect($('.ui-tabs-nav .ui-tabs-active').hasClass('js-hide')).to.be["false"];
      });
    });
    return describe('reorder parts', function() {
      before(function() {
        var body_li;
        $('#page-parts-options').click();
        body_li = $($('.ui-dialog li[data-part="body"]')).detach();
        $('.ui-dialog .records').append(body_li);
        return $('.ui-dialog .ui-dialog-buttonset button').click();
      });
      after(function() {
        $('#page-parts-options').click();
        $('.ui-dialog li label').get(1).click();
        return $('.ui-dialog .ui-dialog-buttonset button').click();
      });
      return it('move body tab to end of list', function() {
        return expect($('.ui-tabs-nav a').last().attr('href')).to.be.eq($('.ui-tabs-nav a[href="#page_part_body"]').attr('href'));
      });
    });
  });

}).call(this);
