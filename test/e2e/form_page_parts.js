(function() {
  describe('PageParts', function() {
    before(function(done) {
      var container, page_parts;
      container = $('#container');
      page_parts = refinery('admin.FormPageParts');
      $.get('/test/fixtures/page_new_parts_default.html', function(response) {
        container.html(response);
        page_parts.init($('#page_parts'));
        return done();
      });
      this.page_parts = page_parts;
      return this.container = container;
    });
    after(function() {
      this.page_parts.destroy();
      return this.container.empty();
    });
    describe('open close dialog', function() {
      it('has openable dialog', function() {
        $('#page_parts-options').click();
        return expect($('.ui-dialog').is(':visible')).to.be["true"];
      });
      it('has openable dialog', function() {
        $('#page_parts-options').click();
        $('.ui-dialog-titlebar-close').click();
        return expect($('.ui-dialog').is(':visible')).to.be["false"];
      });
      return after(function() {
        return $('.ui-dialog-titlebar-close').click();
      });
    });
    describe('activate part', function() {
      before(function(done) {
        $('#page_parts-options').click();
        $('.ui-dialog li[data-part="perex"] input').prop('checked', true);
        $('.ui-dialog .ui-dialog-buttonset button').click();
        return done();
      });
      after(function(done) {
        $('#page_parts-options').click();
        $('.ui-dialog li[data-part="perex"] input').prop('checked', false);
        $('.ui-dialog .ui-dialog-buttonset button').click();
        return done();
      });
      return it('show perex tab', function() {
        return expect($('.ui-tabs-nav li[aria-controls="page_part_perex"]').hasClass('js-hide')).to.be["false"];
      });
    });
    describe('deactivate part', function() {
      before(function(done) {
        $('#page-parts-options').click();
        $('.ui-dialog li[data-part="body"] input').prop('checked', false);
        $('.ui-dialog li[data-part="perex"] input').prop('checked', true);
        $('.ui-dialog .ui-dialog-buttonset button').click();
        return done();
      });
      after(function() {
        $('#page-parts-options').click();
        $('.ui-dialog li[data-part="body"] input').prop('checked', true);
        $('.ui-dialog li[data-part="perex"] input').prop('checked', false);
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
      return it('move body tab to end of list', function() {
        return expect($('.ui-tabs-nav a').last().attr('href')).to.be.eq($('.ui-tabs-nav a[href="#page_part_body"]').attr('href'));
      });
    });
  });

}).call(this);
