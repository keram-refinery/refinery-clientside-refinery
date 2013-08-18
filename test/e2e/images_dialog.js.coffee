refinery.admin.ImagesDialog.prototype.options.url = '/refinery/test/fixtures/images_dialog.json'

describe 'Admin Images Dialog', ->

  before ->
    @container = $('#container')

  after ->
    @container.empty()

  describe 'Class', ->
    after ->

    it 'is instantiable object (with constructor)', ->
      expect( refinery.admin.ImagesDialog ).to.be.an 'function'
      expect( refinery.admin.ImagesDialog.prototype ).to.be.an 'object'


  describe 'Instance', ->
    before ->
      @dialog = new refinery.admin.ImagesDialog

    after ->
      @dialog.destroy(true)

    it 'is instance of refinery.Object', ->
      expect( @dialog ).to.be.an.instanceof refinery.Object

    it 'is instance of refinery.admin.Dialog', ->
      expect( @dialog ).to.be.an.instanceof refinery.admin.Dialog


    describe 'initialised', ->

      before ->
        @dialog.init(@container)

      it 'is initialised', ->
        expect( @dialog.is('initialised') ).to.be.true
        expect( @dialog.is('initialisable') ).to.be.false

      it 'is openable', ->
        expect( @dialog.is('openable') ).to.be.true


    describe 'open', ->

      before ->
        @dialog.open()

      after ->
        @dialog.close()

      it 'is opened', ->
        expect( @dialog.is('opened') ).to.be.true
        expect( @dialog.is('openable') ).to.be.false

      it 'is not closed', ->
        expect( @dialog.is('closed') ).to.be.false
        expect( @dialog.is('closable') ).to.be.true

      it 'has title Images', ->
        expect( $('.ui-dialog-title').text() ).to.be.equal 'Images'


    describe 'load', ->

      before ->

      after ->

      describe 'fail', ->

        before (done) ->
          @dd = new refinery.admin.ImagesDialog({
            url: '/some/nonexistant/url'
          }).init(@container)

          @dd.on 'load', (loaded) ->
            done()

          @dd.open()

        after ->
          @dd.close()
          @dd.destroy(true)

        it 'contain info about load fail', ->
          expect( @dd.holder.text() ).to.have.string 'Dialog content load fail'

        it 'is not loaded', ->
          expect( @dd.is('loaded') ).to.be.false


      describe 'success', ->

        before (done) ->
          @dd = new refinery.admin.ImagesDialog({
            url: '/refinery/test/fixtures/empty_images_dialog.json'
          }).init(@container)

          @dd.on 'load', (loaded) ->
            done()

          @dd.open()

        after ->
          @dd.close()
          @dd.destroy(true)

        it 'is loaded', ->
          expect( @dd.is('loaded') ).to.be.true

        it 'has no info about loading fail', ->
          expect( @dd.holder.text() ).to.have.not.string 'Dialog content load fail'

        it 'contain images', ->
          expect( @dd.holder.text() ).to.have.string 'Library'
          expect( @dd.holder.text() ).to.have.string 'There are no images yet.'


    describe 'tabs', ->

      before (done) ->
        @dd = new refinery.admin.ImagesDialog().init(@container)
        @dd.on 'load', (loaded) ->
          done()

        @dd.open()

      after ->
        @dd.close()
        @dd.destroy(true)

      it 'has tab Library', ->
        expect( @dd.holder.text() ).to.have.string 'Library'

      it 'has tab Url', ->
        expect( @dd.holder.text() ).to.have.string 'Url'


      describe 'Url tab', ->

        before ->
          @dd.holder.find('.ui-tabs').tabs({ active: 1 })

        after ->

        it 'is active', ->
          expect( @dd.holder.find('.ui-tabs-nav .ui-state-active').text() ).to.have.string 'Url'


        describe 'insert success', ->

          before ->
            @return_obj = { 'url': "http://sme.sk/a", 'type': "external" }
            @dd.holder.find('input.text').val @return_obj.url
            @insertSpy = insertSpy = sinon.spy()
            @dd.on 'insert', (img) ->
              insertSpy(img)

            @dd.holder.find('.button.insert-button:visible').click()

          after ->
            @dd.holder.find('input.text').val('')

          it 'return img object', (done) ->
            expect( @insertSpy.called, 'Event did not fire in 1000ms.' ).to.be.true
            expect( @insertSpy.calledOnce, 'Event fired more than once' ).to.be.true
            expect( @insertSpy.calledWith( @return_obj ), 'Retturned object should be: \n' + JSON.stringify(@return_obj) ).to.be.true
            done()


        describe 'insert fail', ->

          before ->
            @insertSpy = sinon.spy()
            @dd.on 'insert', @insertSpy

          after ->
            @dd.holder.find('input.text').val('')

          it 'not fire insert event when url is empty', (done) ->
            @dd.holder.find('input.text').val('')

            @dd.holder.find('.button.insert-button:visible').click()

            expect( @insertSpy.called, 'Event was fired.' ).to.be.false
            done()

          it 'not fire insert event when url input has invalid value', (done) ->
            @dd.holder.find('input.text').val('something invalid')
            @dd.holder.find('.button.insert-button:visible').click()

            expect( @insertSpy.called, 'Event was fired.' ).to.be.false
            done()


      describe 'Library tab', ->

        before ->
          @dd.open()
          @dd.holder.find('.ui-tabs').tabs({ active: 0 })

        after ->

        beforeEach ->
          @insertSpy = insertSpy = sinon.spy()

          @dd.on 'insert', (img) ->
            insertSpy(img)

        it 'is active', ->
          expect( @dd.holder.find('.ui-tabs-nav .ui-state-active').text() ).to.have.string 'Library'


        describe 'insert success', ->

          before ->
            @return_obj = return_obj =
              "id": 1
              "type": "library"

          after ->

          it 'return img object', (done) ->
            @dd.holder.find('.button.insert-button:visible').click()

            expect( @insertSpy.called, 'Event insert did not fire.' ).to.be.true
            expect( @insertSpy.calledOnce, 'Event fired more than once' ).to.be.true
            expect( @insertSpy.calledWith( @return_obj ), 'Returned object should be: \n' + JSON.stringify(@return_obj) ).to.be.true
            done()


        describe 'insert fail', ->

          before ->
            @dd.open()

          after ->
            @dd.close()

          it 'not fire insert event when image is not selected', (done) ->
            @dd.holder.find('#image-1').click()
            @dd.holder.find('.button.insert-button:visible').click()

            expect( @insertSpy.called, 'Event insert was fired.' ).to.be.false
            done()


        describe 'pagination', ->

          before ->
            @dd.open()

          after ->
            @dd.close()

          # todo
          it 'not fire insert event when image is not selected', (done) ->
            @dd.holder.find('.pagination a').first().click()
#            #expect( @insertSpy.called, 'Event insert was fired.' ).to.be.false
            done()

