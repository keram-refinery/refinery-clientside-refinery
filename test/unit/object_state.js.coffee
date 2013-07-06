describe 'refinery.ObjectState', ->
  before ->
    @state = new refinery.ObjectState()

  describe 'empty', ->
    it 'have none states', ->
      expect( @state.states ).to.be.empty

    it 'have property initialisable', ->
      expect( @state ).to.have.property('_initialisable')

    it 'is initialisable', ->
      expect( @state.is('initialisable') ).to.be.true


  describe 'passing default states', ->
    before ->
      @state = new refinery.ObjectState({
          'closed' : true,
          'opened' : false
      })

    it 'returns correct states', ->
      expect( @state.is('closed') ).to.be.true
      expect( @state.is('opened') ).to.be.false
      expect( @state.is('initialising') ).to.be.false
      expect( @state.is('initialised') ).to.be.false


    describe 'custom tests', ->
      before ->
        @state._openable = ->
          return (this.is('initialised') && this.get('closed') &&
                    !this.get('opened') && !this.get('opening'))

        @state._closable = ->
          return (!!this.get('opened') && !this.get('closed') && !this.get('closing'))

      it 'have properties _initialisable, _openable and _closable', ->
        expect( @state ).to.have.property('_initialisable')
        expect( @state ).to.have.property('_openable')
        expect( @state ).to.have.property('_closable')

      it 'is initialisable', ->
        expect( @state.is('initialisable') ).to.be.true

      it 'is openable', ->
        expect( @state.is('openable') ).to.be.false

      it 'is not closable', ->
        expect( @state.is('closable') ).to.be.false

    describe 'initialised', ->

      before ->
        @state.set('initialised', true)

      after ->
        @state.set('initialised', false)

      it 'is not initialisable', ->
        expect( @state.is('initialisable') ).to.be.false

      it 'is openable', ->
        expect( @state.is('openable') ).to.be.true

      it 'is not closable', ->
        expect( @state.is('closable') ).to.be.false


  describe 'opened', ->
    before ->
      @state = new refinery.ObjectState({
          'closed' : true,
          'opened' : false,
          'initialised': true
      })

      @state._openable = ->
        return (this.is('initialised') && this.get('closed') &&
                  !this.get('opened') && !this.get('opening'))

      @state._closable = ->
        return (!!this.get('opened') && !this.get('closed') && !this.get('closing'))

    context 'with set', ->
      before ->
        @state.set({'opened': true, 'closed': false })

      after ->
        @state.set({'opened': false, 'closed': true })

      it 'is not openable', ->
        expect( @state.is('openable') ).to.be.false

      it 'is closable', ->
        expect( @state.is('closable') ).to.be.true

    context 'with toggle', ->
      before ->
        @state.toggle('opened', 'closed')

      it 'is not openable', ->
        expect( @state.is('openable') ).to.be.false

      it 'is closable', ->
        expect( @state.is('closed') ).to.be.false
        expect( @state.is('closable') ).to.be.true


