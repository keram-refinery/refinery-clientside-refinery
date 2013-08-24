describe 'Admin Image Dialog', ->

  before ->
    @container = $('#container')

  after ->
    # @container.empty()

  describe 'Class', ->
    after ->

    it 'is instantiable object (with constructor)', ->
      expect( refinery.admin.ImageDialog ).to.be.an 'function'
      expect( refinery.admin.ImageDialog.prototype ).to.be.an 'object'


  describe 'Instance', ->
    before ->
      @dialog = new refinery.admin.ImageDialog url: '/refinery/test/fixtures/image_dialog.json'

    after ->
      @dialog.destroy(true)

    it 'is instance of refinery.Object', ->
      expect( @dialog ).to.be.an.instanceof refinery.Object

    it 'is instance of refinery.admin.Dialog', ->
      expect( @dialog ).to.be.an.instanceof refinery.admin.Dialog


  describe 'initialised', ->

    before ->
      @dialog = new refinery.admin.ImageDialog url: '/refinery/test/fixtures/image_dialog.json'
      @dialog.init()

    after ->
      @dialog.destroy(true)

    it 'is initialised', ->
      expect( @dialog.is('initialised') ).to.be.true
      expect( @dialog.is('initialisable') ).to.be.false

    it 'is openable', ->
      expect( @dialog.is('openable') ).to.be.true

  describe 'open', ->

    before ->
      @dialog = new refinery.admin.ImageDialog url: '/refinery/test/fixtures/image_dialog.json'
      @dialog.init().open()

    after ->
      @dialog.destroy(true)

    it 'is opened', ->
      expect( @dialog.is('opened') ).to.be.true
      expect( @dialog.is('openable') ).to.be.false

    it 'is not closed', ->
      expect( @dialog.is('closed') ).to.be.false
      expect( @dialog.is('closable') ).to.be.true

    it 'has title Image', ->
      expect( $('.ui-dialog-title').text() ).to.be.equal 'Image'

  describe 'load', ->
    context 'fail', ->

      before (done) ->
        @dialog = new refinery.admin.ImageDialog({
          url: '/some/nonexistant/url'
        }).init()

        @dialog.on 'load', (loaded) ->
          done()

        @dialog.open()

      after ->
        @dialog.destroy(true)

      it 'contain info about load fail', ->
        expect( @dialog.holder.text() ).to.have.string 'Dialog content load fail'

      it 'is not loaded', ->
        expect( @dialog.is('loaded') ).to.be.false


    context 'success', ->
      before (done) ->
        @dialog = new refinery.admin.ImageDialog({
          url: '/refinery/test/fixtures/image_dialog.json'
        }).init()

        @dialog.on 'load', (loaded) ->
          done()

        @dialog.open()

      after ->
        @dialog.destroy(true)

      it 'is loaded', ->
        expect( @dialog.is('loaded') ).to.be.true

      it 'has no info about loading fail', ->
        expect( @dialog.holder.text() ).to.have.not.string 'Dialog content load fail'

      it 'contain image', ->
        expect( @dialog.holder.find('#image-preview').length ).to.be.equal(1)
        expect( @dialog.holder.find('#image-alt').length ).to.be.equal(1)

  describe 'insert', ->
    context 'default', ->

      before (done) ->
        @return_obj = return_obj =
          "id": "1",
          "alt":"Image alt",
          "size":"medium",
          "geometry":"225x255>",
          "sizes":
            "small":"/refinery/test/fixtures/500x350.jpg",
            "original":"/refinery/test/fixtures/500x350.jpg",
            "medium":"/refinery/test/fixtures/500x350.jpg",
            "large":"/refinery/test/fixtures/500x350.jpg",
            "grid":"/refinery/test/fixtures/500x350.jpg"

        @dialog = dialog = new refinery.admin.ImageDialog({
          url: '/refinery/test/fixtures/image_dialog.json'
        }).init()

        @dialog.on 'load', (loaded) ->
          dialog.holder.find('.button.insert-button:visible').click()
          done()

        @insertSpy = insertSpy = sinon.spy()
        @dialog.on 'insert', (img) ->
          insertSpy(img)

        @dialog.open()

      after ->
        @dialog.close()
        @dialog.destroy(true)

      it 'fires insert event', ->
        expect( @insertSpy.called, 'Event insert did not fire.' ).to.be.true
        expect( @insertSpy.calledOnce, 'Event fired more than once' ).to.be.true

      it 'returns image with default medium size selected', ->
        expect( @insertSpy.calledWith( @return_obj ), 'Returned object should be: \n' + JSON.stringify(@return_obj) ).to.be.true
        expect( @return_obj.size ).to.be.equal('medium')

    context 'original', ->

      before (done) ->
        @return_obj = return_obj =
          "id": "1",
          "alt":"Image alt",
          "size":"original",
          "geometry": undefined,
          "sizes":
            "small":"/refinery/test/fixtures/500x350.jpg",
            "original":"/refinery/test/fixtures/500x350.jpg",
            "medium":"/refinery/test/fixtures/500x350.jpg",
            "large":"/refinery/test/fixtures/500x350.jpg",
            "grid":"/refinery/test/fixtures/500x350.jpg"

        @dialog = dialog = new refinery.admin.ImageDialog({
          url: '/refinery/test/fixtures/image_dialog.json'
        }).init()

        @insertSpy = insertSpy = sinon.spy()
        @dialog.on 'insert', (img) ->
          insertSpy(img)

        @dialog.on 'load', (loaded) ->
          uiSelect( dialog.holder.find('a[href="#original"]').parent() )
          dialog.holder.find('.insert-button:visible').click()
          done()

        @dialog.open()

      after ->
        @dialog.destroy(true)

      it 'fires insert event', ->
        expect( @insertSpy.called, 'Event insert did not fire.' ).to.be.true
        expect( @insertSpy.calledOnce, 'Event fired more than once' ).to.be.true

      it 'returns image with original size selected', ->
        expect( @insertSpy.calledWith( @return_obj ), 'Returned object should be: \n' + JSON.stringify(@return_obj) ).to.be.true
        expect( @return_obj.size ).to.be.equal('original')
