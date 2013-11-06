(function() {
  describe('refinery.Object -t-11', function() {
    before(function() {
      return this.obj = new refinery.Object();
    });
    after(function() {
      return this.obj = null;
    });
    it('is instance of refinery.Object', function() {
      return expect(this.obj).to.be.an["instanceof"](refinery.Object);
    });
    context('properties', function() {
      return it('should have properties, id, name, module, version, uid, fullname', function() {
        expect(this.obj).to.have.property('id');
        expect(this.obj).to.have.property('name', 'Object');
        expect(this.obj).to.have.property('module', 'refinery');
        expect(this.obj).to.have.property('version');
        expect(this.obj).to.have.property('uid', this.obj.name + this.obj.id);
        return expect(this.obj).to.have.property('fullname', this.obj.module + '.' + this.obj.name);
      });
    });
    return context('states', function() {
      it('is initialisable', function() {
        return expect(this.obj.is('initialisable')).to.be["true"];
      });
      it('is not openable', function() {
        return expect(this.obj.is('openable')).to.be["false"];
      });
      return describe('initialised', function() {
        before(function() {
          return this.obj.init($('<div/>'));
        });
        it('is initialised', function() {
          return expect(this.obj.is('initialised')).to.be["true"];
        });
        return it('is not initialisable', function() {
          return expect(this.obj.is('initialisable')).to.be["false"];
        });
      });
    });
  });

  describe('refinery.Object subclass', function() {
    before(function() {
      var CustomState;
      CustomState = function(default_states) {
        var states;
        states = $.extend(default_states || {}, {
          'closed': true
        });
        return refinery.ObjectState.call(this, states);
      };
      CustomState.prototype = {
        '_openable': function() {
          return this.get('initialised') && this.get('closed') && !this.get('opening');
        },
        '_closable': function() {
          return !this.get('closing') && this.get('opened');
        },
        '_loadable': function() {
          return !this.get('loading') && !this.get('loaded');
        },
        '_submittable': function() {
          return this.get('initialised') && !this.get('submitting');
        },
        '_insertable': function() {
          return this.get('initialised') && !this.get('inserting');
        }
      };
      $.extend(CustomState.prototype, refinery.ObjectState.prototype);
      refinery.Object.create({
        'name': 'TestClass',
        State: CustomState
      });
      return this.subobj = new refinery.TestClass();
    });
    it('is instance of refinery.Object', function() {
      return expect(this.subobj).to.be.an["instanceof"](refinery.Object);
    });
    return context('states', function() {
      before(function() {
        this.subobj.is('initialised', false);
        return this.subobj.is('initialising', false);
      });
      it('is initialisable', function() {
        return expect(this.subobj.is('initialisable')).to.be["true"];
      });
      it('is not openable', function() {
        return expect(this.subobj.is('openable')).to.be["false"];
      });
      describe('initialised', function() {
        before(function() {
          return this.subobj.init($('<div/>'));
        });
        it('is initialised', function() {
          return expect(this.subobj.is('initialised')).to.be["true"];
        });
        return it('is not initialisable', function() {
          return expect(this.subobj.is('initialisable')).to.be["false"];
        });
      });
      return describe('refinery.TestClass subclass', function() {
        before(function() {
          refinery.Object.create({
            'name': 'TestSubClass',
            objectPrototype: new refinery.TestClass()
          });
          this.subobj = new refinery.TestClass();
          this.subobj2 = new refinery.TestSubClass();
          return this.subobj3 = new refinery.TestSubClass();
        });
        it('is instance of refinery.Object', function() {
          return expect(this.subobj2).to.be.an["instanceof"](refinery.Object);
        });
        it('is instance of refinery.TestClass', function() {
          return expect(this.subobj2).to.be.an["instanceof"](refinery.TestClass);
        });
        it('is initialisable', function() {
          expect(this.subobj.is('initialisable')).to.be["true"];
          return expect(this.subobj2.is('initialisable')).to.be["true"];
        });
        it('is not openable', function() {
          expect(this.subobj.is('openable')).to.be["false"];
          return expect(this.subobj2.is('openable')).to.be["false"];
        });
        return context('states', function() {
          before(function() {
            this.subobj.is('initialised', true);
            return this.subobj.is('initialising', false);
          });
          it('is initialisable', function() {
            expect(this.subobj.is('initialisable')).to.be["false"];
            return expect(this.subobj2.is('initialisable')).to.be["true"];
          });
          context('initialised', function() {
            before(function() {
              this.subobj2.is('initialised', true);
              return this.subobj2.is('initialising', false);
            });
            it('is not initialisable', function() {
              expect(this.subobj2.is('initialisable')).to.be["false"];
              return expect(this.subobj3.is('initialisable')).to.be["true"];
            });
            it('is openable', function() {
              expect(this.subobj2.is('openable')).to.be["true"];
              return expect(this.subobj3.is('openable')).to.be["false"];
            });
            return it('is not closable', function() {
              expect(this.subobj2.is('closable')).to.be["false"];
              return expect(this.subobj3.is('closable')).to.be["false"];
            });
          });
          return context('opening', function() {
            before(function() {
              return this.subobj2.is('opening', true);
            });
            after(function() {
              return this.subobj2.is('opening', false);
            });
            it('is not openable', function() {
              expect(this.subobj2.is('openable')).to.be["false"];
              return expect(this.subobj3.is('openable')).to.be["false"];
            });
            it('is not opened', function() {
              expect(this.subobj2.is('opened')).to.be["false"];
              return expect(this.subobj3.is('openable')).to.be["false"];
            });
            it('is not closable', function() {
              expect(this.subobj2.is('closable')).to.be["false"];
              return expect(this.subobj3.is('closable')).to.be["false"];
            });
            return context('opened', function() {
              before(function() {
                return this.subobj2.is({
                  'opening': false,
                  'opened': true,
                  'closed': false
                });
              });
              after(function() {});
              it('is not openable', function() {
                expect(this.subobj2.is('openable')).to.be["false"];
                return expect(this.subobj3.is('openable')).to.be["false"];
              });
              it('is opened', function() {
                expect(this.subobj2.is('opening')).to.be["false"];
                return expect(this.subobj2.is('opened')).to.be["true"];
              });
              return it('is closable', function() {
                expect(this.subobj2.is('closable')).to.be["true"];
                return expect(this.subobj3.is('closable')).to.be["false"];
              });
            });
          });
        });
      });
    });
  });

}).call(this);
