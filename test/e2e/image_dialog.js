(function() {
  describe('Admin Image Dialog', function() {
    before(function() {
      return this.container = $('#container');
    });
    after(function() {});
    describe('Class', function() {
      after(function() {});
      return it('is instantiable object (with constructor)', function() {
        expect(refinery.admin.ImageDialog).to.be.an('function');
        return expect(refinery.admin.ImageDialog.prototype).to.be.an('object');
      });
    });
    describe('Instance', function() {
      before(function() {
        var dialog;
        this.dialog = dialog = new refinery.admin.ImageDialog({
          image_id: 1
        });
        return this.dialog.options.url = '/test/fixtures/image_dialog.json';
      });
      after(function() {
        return this.dialog.destroy(true);
      });
      it('is instance of refinery.Object', function() {
        return expect(this.dialog).to.be.an["instanceof"](refinery.Object);
      });
      return it('is instance of refinery.admin.Dialog', function() {
        return expect(this.dialog).to.be.an["instanceof"](refinery.admin.Dialog);
      });
    });
    describe('initialised', function() {
      before(function() {
        var dialog;
        this.dialog = dialog = new refinery.admin.ImageDialog({
          image_id: 1
        });
        this.dialog.options.url = '/test/fixtures/image_dialog.json';
        return this.dialog.init();
      });
      after(function() {
        return this.dialog.destroy(true);
      });
      it('is initialised', function() {
        expect(this.dialog.is('initialised')).to.be["true"];
        return expect(this.dialog.is('initialisable')).to.be["false"];
      });
      return it('is openable', function() {
        return expect(this.dialog.is('openable')).to.be["true"];
      });
    });
    describe('open', function() {
      before(function() {
        var dialog;
        this.dialog = dialog = new refinery.admin.ImageDialog({
          image_id: 1
        });
        this.dialog.options.url = '/test/fixtures/image_dialog.json';
        return this.dialog.init().open();
      });
      after(function() {
        return this.dialog.destroy(true);
      });
      it('is opened', function() {
        expect(this.dialog.is('opened')).to.be["true"];
        return expect(this.dialog.is('openable')).to.be["false"];
      });
      it('is not closed', function() {
        expect(this.dialog.is('closed')).to.be["false"];
        return expect(this.dialog.is('closable')).to.be["true"];
      });
      return it('has title Image', function() {
        return expect($('.ui-dialog-title').text()).to.be.equal('Image');
      });
    });
    describe('load', function() {
      context('fail', function() {
        before(function(done) {
          var dialog;
          this.dialog = dialog = new refinery.admin.ImageDialog({
            image_id: 1337
          });
          this.dialog.init();
          this.dialog.on('load', function() {
            return done();
          });
          return this.dialog.open();
        });
        after(function() {
          return this.dialog.destroy(true);
        });
        it('contain info about load fail', function() {
          return expect(this.dialog.holder.text()).to.have.string('Dialog content load fail');
        });
        return it('is not loaded', function() {
          return expect(this.dialog.is('loaded')).to.be["false"];
        });
      });
      return context('success', function() {
        before(function(done) {
          var dialog;
          this.dialog = dialog = new refinery.admin.ImageDialog({
            image_id: 1
          });
          this.dialog.options.url = '/test/fixtures/image_dialog.json';
          this.dialog.init();
          this.dialog.on('load', function() {
            return done();
          });
          return this.dialog.open();
        });
        after(function() {
          return this.dialog.destroy(true);
        });
        it('is loaded', function() {
          return expect(this.dialog.is('loaded')).to.be["true"];
        });
        it('has no info about loading fail', function() {
          return expect(this.dialog.holder.text()).to.have.not.string('Dialog content load fail');
        });
        return it('contain image', function() {
          expect(this.dialog.holder.find('#image-preview').length).to.be.equal(1);
          return expect(this.dialog.holder.find('#image-alt').length).to.be.equal(1);
        });
      });
    });
    return describe('insert', function() {
      context('default', function() {
        before(function(done) {
          var dialog, insertSpy, return_obj;
          this.return_obj = return_obj = {
            "id": "1",
            "alt": "Image alt",
            "size": "medium",
            "geometry": "225x255>",
            "sizes": {
              "small": "/test/fixtures/500x350.jpg",
              "original": "/test/fixtures/500x350.jpg",
              "medium": "/test/fixtures/500x350.jpg",
              "large": "/test/fixtures/500x350.jpg",
              "grid": "/test/fixtures/500x350.jpg"
            }
          };
          this.dialog = dialog = new refinery.admin.ImageDialog({
            image_id: 1
          });
          this.dialog.options.url = '/test/fixtures/image_dialog.json';
          this.dialog.init();
          this.dialog.on('load', function() {
            dialog.insert(dialog.holder.find('form'));
            return done();
          });
          this.insertSpy = insertSpy = sinon.spy();
          this.dialog.on('insert', function(img) {
            return insertSpy(img);
          });
          return this.dialog.open();
        });
        after(function() {
          this.dialog.close();
          return this.dialog.destroy(true);
        });
        it('fires insert event', function() {
          expect(this.insertSpy.called, 'Event insert did not fire.').to.be["true"];
          return expect(this.insertSpy.calledOnce, 'Event fired more than once').to.be["true"];
        });
        return it('returns image with default medium size selected', function() {
          expect(this.insertSpy.calledWith(this.return_obj), 'Returned object should be: \n' + JSON.stringify(this.return_obj)).to.be["true"];
          return expect(this.return_obj.size).to.be.equal('medium');
        });
      });
      return context('original', function() {
        before(function(done) {
          var dialog, insertSpy, return_obj;
          this.return_obj = return_obj = {
            "id": "1",
            "alt": "Image alt",
            "size": "original",
            "geometry": "128x153",
            "sizes": {
              "small": "/test/fixtures/500x350.jpg",
              "original": "/test/fixtures/500x350.jpg",
              "medium": "/test/fixtures/500x350.jpg",
              "large": "/test/fixtures/500x350.jpg",
              "grid": "/test/fixtures/500x350.jpg"
            }
          };
          this.dialog = dialog = new refinery.admin.ImageDialog({
            image_id: 1
          });
          this.dialog.options.url = '/test/fixtures/image_dialog.json';
          this.dialog.init();
          this.insertSpy = insertSpy = sinon.spy();
          this.dialog.on('insert', function(img) {
            return insertSpy(img);
          });
          this.dialog.on('load', function() {
            uiSelect(dialog.holder.find('a[href="#original"]').parent());
            dialog.holder.find('form').submit();
            return done();
          });
          return this.dialog.open();
        });
        after(function() {
          return this.dialog.destroy(true);
        });
        it('fires insert event', function() {
          expect(this.insertSpy.called, 'Event insert did not fire.').to.be["true"];
          return expect(this.insertSpy.calledOnce, 'Event fired more than once').to.be["true"];
        });
        return it('returns image with original size selected', function() {
          expect(this.insertSpy.calledWith(this.return_obj), 'Returned object should be: \n' + JSON.stringify(this.return_obj)).to.be["true"];
          return expect(this.return_obj.size).to.be.equal('original');
        });
      });
    });
  });

}).call(this);
