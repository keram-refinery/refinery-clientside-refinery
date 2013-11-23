(function() {
  describe('refinery.admin.Form', function() {
    before(function() {
      return this.form = new refinery.admin.Form();
    });
    after(function() {
      return this.form.destroy();
    });
    it('is instance of refinery.Object', function() {
      return expect(this.form).to.be.an["instanceof"](refinery.Object);
    });
    describe('absolutize_url', function() {
      context('already absolute url', function() {
        before(function() {
          this.url = 'http://refinery.sk';
          this.new_url = this.form.absolutize_url(this.url);
          this.url2 = 'https://refinery.sk';
          return this.new_url2 = this.form.absolutize_url(this.url2);
        });
        return it('url and new_url are the same', function() {
          expect(this.new_url).to.be.equal(this.url);
          return expect(this.new_url2).to.be.equal(this.url2);
        });
      });
      return context('relative url', function() {
        before(function() {
          this.url = '/sk/refinery';
          return this.new_url = this.form.absolutize_url(this.url);
        });
        return it('absolutize', function() {
          return expect(this.new_url).to.be.equal(document.location.origin + this.url);
        });
      });
    });
    return describe('get_right_url', function() {
      context('without redirect', function() {
        before(function() {
          this.url = 'http://' + document.location.host + '/en';
          this.new_url = this.form.get_right_url(this.url);
          this.url2 = '/en';
          return this.new_url2 = this.form.get_right_url(this.url2);
        });
        return it('returns right url', function() {
          expect(this.new_url).to.be.equal(this.url);
          return expect(this.new_url2).to.be.equal(document.location.origin + this.url2);
        });
      });
      return context('with redirect', function() {
        context('/sk/refinery -> /en/refinery', function() {
          before(function() {
            this.url = '/sk/refinery';
            this.redirect = 'http://' + document.location.host + '/en/something/different';
            return this.new_url = this.form.get_right_url(this.url, this.redirect);
          });
          return it('returns right url', function() {
            return expect(this.new_url).to.be.equal(document.location.origin + '/sk/something/different');
          });
        });
        context('/sk/refinery -> /refinery', function() {
          before(function() {
            this.url = '/sk/refinery';
            this.redirect = 'http://' + document.location.host + '/something/different';
            return this.new_url = this.form.get_right_url(this.url, this.redirect);
          });
          return it('returns right url', function() {
            return expect(this.new_url).to.be.equal(document.location.origin + '/sk/something/different');
          });
        });
        return context('/refinery -> /en/refinery', function() {
          before(function() {
            this.url = '/refinery';
            this.redirect = 'http://' + document.location.host + '/en/something/different';
            return this.new_url = this.form.get_right_url(this.url, this.redirect);
          });
          return it('returns right url', function() {
            return expect(this.new_url).to.be.equal(document.location.origin + '/something/different');
          });
        });
      });
    });
  });

}).call(this);
