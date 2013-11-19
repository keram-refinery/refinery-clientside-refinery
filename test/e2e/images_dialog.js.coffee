refinery.admin.ImagesDialog.prototype.options.url = '/test/fixtures/images_dialog.json'

describe 'Admin Images Dialog', ->

  before ->
    @container = $('#container')

  after ->
    # @container.empty()

  describe 'Class', ->
    after ->

    it 'is instantiable object (with constructor)', ->
      expect( refinery.admin.ImagesDialog ).to.be.an 'function'
      expect( refinery.admin.ImagesDialog.prototype ).to.be.an 'object'


  describe 'Instance', ->
    before ->
      @dialog = refinery('admin.ImagesDialog')

    after ->
      @dialog.destroy()

    it 'is instance of refinery.Object', ->
      expect( @dialog ).to.be.an.instanceof refinery.Object

    it 'is instance of refinery.admin.Dialog', ->
      expect( @dialog ).to.be.an.instanceof refinery.admin.Dialog


  describe 'initialised', ->

    before ->
      @dialog = refinery('admin.ImagesDialog')
      @dialog.init()

    after ->
      @dialog.destroy()

    it 'is initialised', ->
      expect( @dialog.is('initialised') ).to.be.true
      expect( @dialog.is('initialisable') ).to.be.false

    it 'is openable', ->
      expect( @dialog.is('openable') ).to.be.true

  describe 'open', ->

    before ->
      @dialog = refinery('admin.ImagesDialog')
      @dialog.init().open()

    after ->
      @dialog.destroy()

    it 'is opened', ->
      expect( @dialog.is('opened') ).to.be.true
      expect( @dialog.is('openable') ).to.be.false

    it 'is not closed', ->
      expect( @dialog.is('closed') ).to.be.false
      expect( @dialog.is('closable') ).to.be.true

    it 'has title Images', ->
      expect( $('.ui-dialog-title').text() ).to.be.equal 'Images'


  describe 'load', ->
    context 'fail', ->

      before (done) ->
        @dialog = refinery('admin.ImagesDialog', {
          url: '/some/nonexistant/url'
        }).init()

        @dialog.on 'load', ->
          done()

        @dialog.open()

      after ->
        @dialog.destroy()

      it 'contain info about load fail', ->
        expect( @dialog.holder.text() ).to.have.string 'Dialog content load fail'

      it 'is not loaded', ->
        expect( @dialog.is('loaded') ).to.be.false


    context 'success', ->

      before (done) ->
        @dialog = refinery('admin.ImagesDialog', {
          url: '/test/fixtures/empty_images_dialog.json'
        }).init()

        @dialog.on 'load', ->
          done()

        @dialog.open()

      after ->
        @dialog.destroy()

      it 'is loaded', ->
        expect( @dialog.is('loaded') ).to.be.true

      it 'has no info about loading fail', ->
        expect( @dialog.holder.text() ).to.have.not.string 'Dialog content load fail'

      it 'contain images', ->
        expect( @dialog.holder.text() ).to.have.string 'Library'
        expect( @dialog.holder.text() ).to.have.string 'There are no images yet.'


  describe 'tabs', ->

    before (done) ->
      @dialog = refinery('admin.ImagesDialog').init()
      @dialog.on 'load', ->
        done()

      @dialog.open()

    after ->
      @dialog.destroy()

    it 'has tab Library', ->
      expect( @dialog.holder.text() ).to.have.string 'Library'

    it 'has tab Url', ->
      expect( @dialog.holder.text() ).to.have.string 'Url'

    it 'has tab Upload', ->
      expect( @dialog.holder.text() ).to.have.string 'Upload'


    describe 'Url tab', ->

      before ->
        @dialog.open()
        @dialog.holder.find('.ui-tabs').tabs({ active: 1 })

      after ->

      it 'is active', ->
        expect( @dialog.holder.find('.ui-tabs-nav .ui-state-active').text() ).to.have.string 'Url'


      describe 'insert success', ->

        before ->
          @return_obj = { 'url': "http://sme.sk/a", 'alt': '' }
          @dialog.holder.find('input[type="url"]').val @return_obj.url
          @insertSpy = insertSpy = sinon.spy()
          @dialog.on 'insert', (img) ->
            insertSpy(img)

          @dialog.holder.find('input[type="submit"]:visible').click()

        after ->
          @dialog.holder.find('input.text').val('')

        it 'return img object', (done) ->
          expect( @insertSpy.called, 'Event did not fire in 1000ms.' ).to.be.true
          expect( @insertSpy.calledOnce, 'Event fired more than once' ).to.be.true
          expect( @insertSpy.calledWith( @return_obj ), 'Returned object should be: \n' + JSON.stringify(@return_obj) ).to.be.true
          done()


      describe 'insert fail', ->

        before ->
          @insertSpy = sinon.spy()
          @dialog.on 'insert', @insertSpy

        after ->
          @dialog.holder.find('input.text').val('')

        it 'not fire insert event when url is empty', (done) ->
          @dialog.holder.find('input.text').val('')

          @dialog.holder.find('.button.insert-button:visible').click()

          expect( @insertSpy.called, 'Event was fired.' ).to.be.false
          done()

        it 'not fire insert event when url input has invalid value', (done) ->
          @dialog.holder.find('input.text').val('something invalid')
          @dialog.holder.find('.button.insert-button:visible').click()

          expect( @insertSpy.called, 'Event was fired.' ).to.be.false
          done()


    describe 'Library tab', ->

      before ->
        @dialog.open()
        @dialog.holder.find('.ui-tabs').tabs({ active: 0 })

      after ->

      it 'is active', ->
        expect( @dialog.holder.find('.ui-tabs-nav .ui-state-active').text() ).to.have.string 'Library'


      describe 'insert success', ->

        before ->
          @insertSpy = insertSpy = sinon.spy()

          @dialog.on 'insert', (img) ->
            insertSpy(img)

          @return_obj = return_obj =
            "id": 3
            "thumbnail": "/test/fixtures/300x200-a.jpg"

          uiSelect( @dialog.holder.find('.ui-selectable .ui-selectee').first() )

        after ->

        it 'return img object', (done) ->
          expect( @insertSpy.called, 'Event insert did not fire.' ).to.be.true
          expect( @insertSpy.calledOnce, 'Event fired more than once' ).to.be.true
          expect( @insertSpy.calledWith( @return_obj ), 'Returned object should be: \n' + JSON.stringify(@return_obj) ).to.be.true
          done()

    describe 'Upload tab', ->

      before ->
        @dialog.open()
        @dialog.holder.find('.ui-tabs').tabs({ active: 2 })

      after ->

      beforeEach ->
        @insertSpy = insertSpy = sinon.spy()

        @dialog.on 'insert', (img) ->
          insertSpy(img)

      it 'is active', ->
        expect( @dialog.holder.find('.ui-tabs-nav .ui-state-active').text() ).to.have.string 'Upload'


      describe 'insert success', ->

        before ->
          @server = sinon.fakeServer.create()
          @return_obj = return_obj =
            "id": "1"

          $('#new_image').submit()

        after ->
          @server.restore()

        # todo
        # it 'return img object', (done) ->
        #   # expect( @insertSpy.called, 'Event insert did not fire.' ).to.be.true
        #   # expect( @insertSpy.calledOnce, 'Event fired more than once' ).to.be.true
        #   # expect( @insertSpy.calledWith( @return_obj ), 'Returned object should be: \n' + JSON.stringify(@return_obj) ).to.be.true
        #   done()
