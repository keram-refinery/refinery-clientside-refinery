(function() {
  describe('refinery.ObjectState', function() {
    before(function() {
      return this.state = new refinery.ObjectState();
    });
    describe('empty', function() {
      it('have none states', function() {
        return expect(this.state.states).to.be.empty;
      });
      it('have property initialisable', function() {
        return expect(this.state).to.have.property('_initialisable');
      });
      return it('is initialisable', function() {
        return expect(this.state.is('initialisable')).to.be["true"];
      });
    });
    describe('passing default states', function() {
      before(function() {
        return this.state = new refinery.ObjectState({
          'closed': true,
          'opened': false
        });
      });
      it('returns correct states', function() {
        expect(this.state.is('closed')).to.be["true"];
        expect(this.state.is('opened')).to.be["false"];
        expect(this.state.is('initialising')).to.be["false"];
        return expect(this.state.is('initialised')).to.be["false"];
      });
      describe('custom tests', function() {
        before(function() {
          this.state._openable = function() {
            return this.is('initialised') && this.get('closed') && !this.get('opened') && !this.get('opening');
          };
          return this.state._closable = function() {
            return !!this.get('opened') && !this.get('closed') && !this.get('closing');
          };
        });
        it('have properties _initialisable, _openable and _closable', function() {
          expect(this.state).to.have.property('_initialisable');
          expect(this.state).to.have.property('_openable');
          return expect(this.state).to.have.property('_closable');
        });
        it('is initialisable', function() {
          return expect(this.state.is('initialisable')).to.be["true"];
        });
        it('is openable', function() {
          return expect(this.state.is('openable')).to.be["false"];
        });
        return it('is not closable', function() {
          return expect(this.state.is('closable')).to.be["false"];
        });
      });
      return describe('initialised', function() {
        before(function() {
          return this.state.set('initialised', true);
        });
        after(function() {
          return this.state.set('initialised', false);
        });
        it('is not initialisable', function() {
          return expect(this.state.is('initialisable')).to.be["false"];
        });
        it('is openable', function() {
          return expect(this.state.is('openable')).to.be["true"];
        });
        return it('is not closable', function() {
          return expect(this.state.is('closable')).to.be["false"];
        });
      });
    });
    return describe('opened', function() {
      before(function() {
        this.state = new refinery.ObjectState({
          'closed': true,
          'opened': false,
          'initialised': true
        });
        this.state._openable = function() {
          return this.is('initialised') && this.get('closed') && !this.get('opened') && !this.get('opening');
        };
        return this.state._closable = function() {
          return !!this.get('opened') && !this.get('closed') && !this.get('closing');
        };
      });
      return context('with set', function() {
        before(function() {
          return this.state.set({
            'opened': true,
            'closed': false
          });
        });
        after(function() {
          return this.state.set({
            'opened': false,
            'closed': true
          });
        });
        it('is not openable', function() {
          return expect(this.state.is('openable')).to.be["false"];
        });
        return it('is closable', function() {
          return expect(this.state.is('closable')).to.be["true"];
        });
      });
    });
  });

}).call(this);
