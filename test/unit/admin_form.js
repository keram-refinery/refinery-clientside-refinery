(function() {
  describe('refinery.admin.Form', function() {
    before(function() {
      return this.form = new refinery.admin.Form();
    });
    after(function() {
      return this.form.destroy();
    });
    return it('is instance of refinery.Object', function() {
      return expect(this.form).to.be.an["instanceof"](refinery.Object);
    });
  });

}).call(this);
