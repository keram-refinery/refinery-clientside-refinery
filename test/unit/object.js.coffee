describe 'refinery.Object', ->
  before ->
    @obj = new refinery.Object()

  after ->
    @obj = null

  it 'is instance of refinery.Object', ->
    expect( @obj ).to.be.an.instanceof(refinery.Object)

  context 'properties', ->
    it 'should have properties, id, name, module, version, uid, fullname', ->
      expect( @obj ).to.have.property('id')
      expect( @obj ).to.have.property('name', 'Object')
      expect( @obj ).to.have.property('module', 'refinery')
      expect( @obj ).to.have.property('version')
      expect( @obj ).to.have.property('uid', @obj.name + @obj.id)
      expect( @obj ).to.have.property('fullname', @obj.module + '.' + @obj.name)

  context 'states', ->
    it 'is initialisable', ->
      expect( @obj.is('initialisable') ).to.be.true

    it 'is not openable', ->
      expect( @obj.is('openable') ).to.be.false


    describe 'initialised', ->
      before ->
        @obj.init($('<div/>'))

      it 'is initialised', ->
        expect( @obj.is('initialised') ).to.be.true

      it 'is not initialisable', ->
        expect( @obj.is('initialisable') ).to.be.false


describe 'refinery.Object subclass', ->
  before ->

    CustomState = (default_states) ->
      states = $.extend(default_states || {}, {
        'closed' : true
      })

      refinery.ObjectState.call(this, states)

    CustomState:: =
      '_openable': ->
        return (this.get('initialised') && this.get('closed') && !this.get('opening'))
      '_closable': ->
        return (!this.get('closing') && this.get('opened'))
      '_loadable': ->
        return (!this.get('loading') && !this.get('loaded'))
      '_submittable': ->
        return (this.get('initialised') && !this.get('submitting'))
      '_insertable': ->
        return (this.get('initialised') && !this.get('inserting'))

    $.extend(CustomState::, refinery.ObjectState::)

    refinery.Object.create({
      'name': 'TestClass',
      State: CustomState
    })

    @subobj = new refinery.TestClass()

  it 'is instance of refinery.Object', ->
    expect( @subobj ).to.be.an.instanceof(refinery.Object)

  context 'states', ->
    before ->
      @subobj.is('initialised', false)
      @subobj.is('initialising', false)

    it 'is initialisable', ->
      expect( @subobj.is('initialisable') ).to.be.true

    it 'is not openable', ->
      expect( @subobj.is('openable') ).to.be.false


    describe 'initialised', ->
      before ->
        @subobj.init($('<div/>'))

      it 'is initialised', ->
          expect( @subobj.is('initialised') ).to.be.true

      it 'is not initialisable', ->
          expect( @subobj.is('initialisable') ).to.be.false


    describe 'refinery.TestClass subclass', ->
      before ->
        refinery.Object.create({
            'name': 'TestSubClass',
            objectPrototype: new refinery.TestClass()
        })

        @subobj = new refinery.TestClass()

        @subobj2 = new refinery.TestSubClass()
        @subobj3 = new refinery.TestSubClass()

      it 'is instance of refinery.Object', ->
        expect( @subobj2 ).to.be.an.instanceof(refinery.Object)

      it 'is instance of refinery.TestClass', ->
        expect( @subobj2 ).to.be.an.instanceof(refinery.TestClass)

      it 'is initialisable', ->
        expect( @subobj.is('initialisable') ).to.be.true
        expect( @subobj2.is('initialisable') ).to.be.true

      it 'is not openable', ->
        expect( @subobj.is('openable') ).to.be.false
        expect( @subobj2.is('openable') ).to.be.false


      context 'states', ->
        before ->
          @subobj.is('initialised', true)
          @subobj.is('initialising', false)

        it 'is initialisable', ->
          expect( @subobj.is('initialisable') ).to.be.false
          expect( @subobj2.is('initialisable') ).to.be.true


        context 'initialised', ->
          before ->
              @subobj2.is('initialised', true)
              @subobj2.is('initialising', false)

          it 'is not initialisable', ->
              expect( @subobj2.is('initialisable') ).to.be.false
              expect( @subobj3.is('initialisable') ).to.be.true

          it 'is openable', ->
              expect( @subobj2.is('openable') ).to.be.true
              expect( @subobj3.is('openable') ).to.be.false

          it 'is not closable', ->
              expect( @subobj2.is('closable') ).to.be.false
              expect( @subobj3.is('closable') ).to.be.false


        context 'opening', ->
          before ->
              @subobj2.is('opening', true)

          after ->
              @subobj2.is('opening', false)

          it 'is not openable', ->
              expect( @subobj2.is('openable') ).to.be.false
              expect( @subobj3.is('openable') ).to.be.false

          it 'is not opened', ->
              expect( @subobj2.is('opened') ).to.be.false
              expect( @subobj3.is('openable') ).to.be.false

          it 'is not closable', ->
              expect( @subobj2.is('closable') ).to.be.false
              expect( @subobj3.is('closable') ).to.be.false


          context 'opened', ->
            before ->
              @subobj2.is({'opening': false, 'opened': true, 'closed': false})

            after ->

            it 'is not openable', ->
              expect( @subobj2.is('openable') ).to.be.false
              expect( @subobj3.is('openable') ).to.be.false

            it 'is opened', ->
              expect( @subobj2.is('opening') ).to.be.false
              expect( @subobj2.is('opened') ).to.be.true

            it 'is closable', ->
              expect( @subobj2.is('closable') ).to.be.true
              expect( @subobj3.is('closable') ).to.be.false

