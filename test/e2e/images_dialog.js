(function() {
  refinery.admin.ImagesDialog.prototype.options.url_path = '/fixtures/images_dialog.json';

  refinery.admin.backend_path = function() {
    return '/test';
  };

  describe('Admin Images Dialog', function() {
    before(function() {
      return this.container = $('#container');
    });
    after(function() {
      $('.ui-dialog').each(function() {
        var e;
        try {
          return $(this).dialog('destroy');
        } catch (_error) {
          e = _error;
        } finally {
          $(this).remove();
        }
      });
      return this.container.empty();
    });
    describe('Class', function() {
      after(function() {});
      return it('is instantiable object (with constructor)', function() {
        expect(refinery.admin.ImagesDialog).to.be.an('function');
        return expect(refinery.admin.ImagesDialog.prototype).to.be.an('object');
      });
    });
    describe('Instance', function() {
      before(function() {
        return this.dialog = refinery('admin.ImagesDialog');
      });
      after(function() {
        return this.dialog.destroy();
      });
      it('is instance of refinery.Object', function() {
        return expect(this.dialog).to.be.an["instanceof"](refinery.Object);
      });
      return it('is instance of refinery.admin.Dialog', function() {
        return expect(this.dialog).to.be.an["instanceof"](refinery.admin.Dialog);
      });
    });
    describe('Destroy', function() {
      return it('decrease number of dialogs', function() {
        var images_dialogs_after, images_dialogs_before;
        this.dialog = refinery('admin.ImagesDialog').init();
        images_dialogs_before = $('.ui-dialog').length;
        this.dialog.destroy();
        images_dialogs_after = $('.ui-dialog').length;
        expect(images_dialogs_before).to.be.equal(1);
        return expect(images_dialogs_after).to.be.equal(0);
      });
    });
    describe('initialised', function() {
      before(function() {
        return this.dialog = refinery('admin.ImagesDialog').init();
      });
      after(function() {
        return this.dialog.destroy();
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
        this.dialog = refinery('admin.ImagesDialog');
        return this.dialog.init().open();
      });
      after(function() {
        return this.dialog.destroy();
      });
      it('is opened', function() {
        expect(this.dialog.is('opened')).to.be["true"];
        return expect(this.dialog.is('openable')).to.be["false"];
      });
      it('is not closed', function() {
        expect(this.dialog.is('closed')).to.be["false"];
        return expect(this.dialog.is('closable')).to.be["true"];
      });
      return it('has title Images', function() {
        return expect($('.ui-dialog-title').first().text()).to.be.equal('Images');
      });
    });
    describe('load', function() {
      context('fail', function() {
        before(function(done) {
          this.dialog = refinery('admin.ImagesDialog', {
            url_path: '/some/nonexistant/url'
          }).init();
          this.dialog.on('load', function() {
            return done();
          });
          return this.dialog.open();
        });
        after(function() {
          return this.dialog.destroy();
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
          this.dialog = refinery('admin.ImagesDialog').init();
          this.dialog.on('load', function() {
            return done();
          });
          return this.dialog.open();
        });
        after(function() {
          return this.dialog.destroy();
        });
        it('is loaded', function() {
          return expect(this.dialog.is('loaded')).to.be["true"];
        });
        it('has no info about loading fail', function() {
          return expect(this.dialog.holder.text()).to.have.not.string('Dialog content load fail');
        });
        return it('contain images', function() {
          expect(this.dialog.holder.text()).to.have.string('Library');
          return expect(this.dialog.holder.find('.image img')).to.have.length.above(0);
        });
      });
    });
    describe('tabs', function() {
      before(function(done) {
        this.dialog = refinery('admin.ImagesDialog').init();
        this.dialog.on('load', function() {
          return done();
        });
        return this.dialog.open();
      });
      after(function() {
        return this.dialog.destroy();
      });
      it('has tab Library', function() {
        return expect(this.dialog.holder.text()).to.have.string('Library');
      });
      it('has tab Url', function() {
        return expect(this.dialog.holder.text()).to.have.string('Url');
      });
      return it('has tab Upload', function() {
        return expect(this.dialog.holder.text()).to.have.string('Upload');
      });
    });
    describe('Url tab', function() {
      before(function(done) {
        var dialog;
        this.dialog = dialog = refinery('admin.ImagesDialog').init();
        this.dialog.on('load', function() {
          dialog.holder.find('.ui-tabs').tabs({
            active: 1
          });
          return done();
        });
        return this.dialog.open();
      });
      after(function() {
        return this.dialog.destroy();
      });
      it('is active', function() {
        return expect(this.dialog.holder.find('.ui-tabs-nav .ui-state-active').text()).to.have.string('Url');
      });
      describe('insert success', function() {
        before(function() {
          var insertSpy;
          this.dialog.open();
          this.return_obj = {
            'url': "http://sme.sk/a",
            'alt': ''
          };
          this.dialog.holder.find('input[type="url"]').val(this.return_obj.url);
          this.insertSpy = insertSpy = sinon.spy();
          this.dialog.on('insert', function(img) {
            return insertSpy(img);
          });
          return this.dialog.holder.find('input[type="submit"]:visible').click();
        });
        after(function() {
          return this.dialog.holder.find('input.text').val('');
        });
        return it('return img object', function(done) {
          expect(this.insertSpy.called, 'Event did not fire in 1000ms.').to.be["true"];
          expect(this.insertSpy.calledOnce, 'Event fired more than once').to.be["true"];
          expect(this.insertSpy.calledWith(this.return_obj), 'Returned object should be: \n' + JSON.stringify(this.return_obj)).to.be["true"];
          return done();
        });
      });
      return describe('insert fail', function() {
        before(function() {
          this.dialog.open();
          this.insertSpy = sinon.spy();
          return this.dialog.on('insert', this.insertSpy);
        });
        after(function() {
          return this.dialog.holder.find('input.text').val('');
        });
        it('not fire insert event when url is empty', function(done) {
          this.dialog.holder.find('input.text').val('');
          this.dialog.holder.find('.button.insert-button:visible').click();
          expect(this.insertSpy.called, 'Event was fired.').to.be["false"];
          return done();
        });
        return it('not fire insert event when url input has invalid value', function(done) {
          this.dialog.holder.find('input.text').val('something invalid');
          this.dialog.holder.find('.button.insert-button:visible').click();
          expect(this.insertSpy.called, 'Event was fired.').to.be["false"];
          return done();
        });
      });
    });
    return describe('Library tab', function() {
      before(function(done) {
        var dialog;
        this.dialog = dialog = refinery('admin.ImagesDialog').init();
        this.dialog.on('load', function() {
          dialog.holder.find('.ui-tabs').tabs({
            active: 0
          });
          return done();
        });
        return this.dialog.open();
      });
      after(function() {
        return this.dialog.destroy();
      });
      it('is active', function() {
        return expect(this.dialog.holder.find('.ui-tabs-nav .ui-state-active').text()).to.have.string('Library');
      });
      return describe('insert success', function() {
        before(function() {
          var insertSpy, return_obj;
          this.insertSpy = insertSpy = sinon.spy();
          this.dialog.on('insert', function(img) {
            return insertSpy(img);
          });
          this.return_obj = return_obj = {
            "id": 3,
            "thumbnail": "/test/fixtures/300x200-a.jpg"
          };
          return uiSelect(this.dialog.holder.find('.ui-selectable .ui-selectee').first());
        });
        return it('return img object', function(done) {
          expect(this.insertSpy.called, 'Event insert did not fire.').to.be["true"];
          expect(this.insertSpy.calledOnce, 'Event fired more than once').to.be["true"];
          expect(this.insertSpy.calledWith(this.return_obj), 'Returned object should be: \n' + JSON.stringify(this.return_obj)).to.be["true"];
          return done();
        });
      });
    });
  });

}).call(this);
