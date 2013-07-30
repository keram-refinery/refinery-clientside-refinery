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

      it 'has title Image', ->
        expect( $('.ui-dialog-title').text() ).to.be.equal 'Image'


    describe 'load', ->

      before ->
        @dd = new refinery.admin.ImagesDialog().init(@container)
        @ajaxStub = sinon.stub($, 'ajax')

        @errorResponse = () ->
          d = $.Deferred()
          d.reject({}, 404, 'something went wrong')
          d.promise()

        @okResponse = () ->
          d = $.Deferred()

          d.resolve(
            { html: ['<div class="dialog-content-wrapper clearfix ui-tabs ui-tabs-vertical">' +
                     '<ul class="ui-tabs-nav"> ' +
                     '<li class="ui-state-active"><a href="#existing-image-area" >Library</a> </li> ' +
                     '</ul>' +
                     '<div id="existing-image-area" class="ui-tabs-panel" > <div class="flash flash-notice" > There are no images yet. Click &quot;Add new image&quot; to add your first image. </div> <div class="form-actions clearfix"> <div class="form-actions-left"> <a class="button secondary-button cancel-button" href="">Close</a> </div>' +
                     '<div class="form-actions-right"> </div> </div> </div> </div>'] },
            'success',
            {
              getResponseHeader: (args) ->
                false
            }
          )
          d.promise()

      after ->
        $.ajax.restore()


      describe 'fail', ->

        before ->
          @ajaxStub.returns(@errorResponse())
          @dd.open()

        after ->
          @dd.close()

        it 'contain info about load fail', ->
          expect( @dd.holder.text() ).to.have.string 'Dialog content load fail'

        it 'is not loaded', ->
          expect( @dd.is('loaded') ).to.be.false


      describe 'success', ->

        before ->
          @ajaxStub.returns(@okResponse())
          @dd.open()

        after ->
          @dd.close()


        it 'is loaded', ->
          expect( @dd.is('loaded') ).to.be.true

        it 'has no info about loading fail', ->
          expect( @dd.holder.text() ).to.have.not.string 'Dialog content load fail'

        it 'contain images', ->
          expect( @dd.holder.text() ).to.have.string 'Library'
          expect( @dd.holder.text() ).to.have.string 'There are no images yet.'


    describe 'tabs', ->

      before ->
        @dd = new refinery.admin.ImagesDialog().init(@container)
        @ajaxStub = sinon.stub($, 'ajax')

        @okResponse = () ->
          d = $.Deferred()

          d.resolve(
            { html: [ '<div class="dialog-content-wrapper clearfix ui-tabs ui-tabs-vertical">' +
                      '<ul class="ui-tabs-nav"> ' +
                        '<li><a href="#existing-image-area" >Library</a> </li> ' +
                        '<li><a href="#external-image-area">Url</a> </li> ' +
                      '</ul>' +
                      '<div id="existing-image-area" class="ui-tabs-panel" >' +
                      ' <ul class="records image-grid clearfix ui-selectable" id="dialog-refinery-images">' +
                      '   <li id="image-1">' +
                      '   <a href="/refinery/test/fixtures/img.png" class="image">' +
                      '       <img width="100" height="100" src="/refinery/test/fixtures/img.png" ' +
                      '           data-small="/refinery/test/fixtures/img.png" ' +
                      '           data-original="/refinery/test/fixtures/img.png" ' +
                      '           data-medium="/refinery/test/fixtures/img.png" data-large="/refinery/test/fixtures/img.png"' +
                      '           data-id="1" data-grid="/refinery/test/fixtures/img.png">' +
                      ' </a></li>' +
                      ' </ul>' +
                      ' <div class="pagination"><span class="previous_page disabled">«</span> <em class="current">1</em> ' +
                      '   <a href="/refinery/dialogs/images?page=2" rel="next">2</a> ' +
                      '   <a href="/refinery/dialogs/images?page=3">3</a> ' +
                      '   <a href="/refinery/dialogs/images?page=2" rel="next" class="next_page">»</a>' +
                      ' </div>' +
                      ' <div class="form-actions clearfix">' +
                      '   <div class="form-actions-left">' +
                      '     <input type="submit" value="Insert" data-disable-with="Processing" class="button insert-button">' +
                      '     <a href="" class="button secondary-button cancel-button">Close</a>' +
                      '   </div>' +
                      '   <div class="form-actions-right">' +
                      '   </div>' +
                      ' </div>' +
                      '</div>' +
                      '<div id="external-image-area" class="ui-tabs-panel" >' +
                      '  <div class="field"> <input type="url" class="widest larger text" > </div>' +
                      '  <div class="form-actions clearfix">' +
                      '    <div class="form-actions-left">' +
                      '      <input class="button insert-button" data-disable-with="Processing" type="submit" value="Insert" />' +
                      '      <a class="button secondary-button cancel-button" href="">Cancel</a>' +
                      '    </div>' +
                      '    <div class="form-actions-right"> </div>' +
                      '  </div>' +
                      '</div>' +
                      '</div>'
            ] },
            'success',
            {
              getResponseHeader: (args) ->
                false
            }
          )
          d.promise()

        @ajaxStub.returns(@okResponse())
        @dd.open()

      after ->
        $.ajax.restore()

      it 'has tab Library', ->
        expect( @dd.holder.text() ).to.have.string 'Library'

      it 'has tab Url', ->
        expect( @dd.holder.text() ).to.have.string 'Url'


      describe 'Url tab', ->

        before ->
          @dd.holder.find('.ui-tabs').tabs({ active: 1 })

        after

        it 'is active', ->
          expect( @dd.holder.find('.ui-tabs-nav .ui-state-active').text() ).to.have.string 'Url'


        describe 'insert success', ->

          before ->
            @return_obj = { 'size': 'original', 'original': "http://sme.sk/a", 'type': "external" }
            @dd.holder.find('input.text').val @return_obj.original
            @eventSpy = sinon.spy()
            @dd.on 'insert', @eventSpy

          after ->
            @dd.holder.find('input.text').val('')

          it 'return img object', (done) ->
            @dd.holder.find('.button.insert-button:visible').click()

            expect( @eventSpy.called, 'Event did not fire in 1000ms.' ).to.be.true
            expect( @eventSpy.calledOnce, 'Event fired more than once' ).to.be.true
            expect( @eventSpy.calledWith( @return_obj ), 'Retturned object should be: \n' + JSON.stringify(@return_obj) ).to.be.true
            done()


        describe 'insert fail', ->

          before ->
            @eventSpy = sinon.spy()
            @dd.on 'insert', @eventSpy

          after ->
            @dd.holder.find('input.text').val('')

          it 'not fire insert event when url is empty', (done) ->
            @dd.holder.find('input.text').val('')

            @dd.holder.find('.button.insert-button:visible').click()

            expect( @eventSpy.called, 'Event was fired.' ).to.be.false
            done()

          it 'not fire insert event when url input has invalid value', (done) ->
            @dd.holder.find('input.text').val('something invalid')
            @dd.holder.find('.button.insert-button:visible').click()

            expect( @eventSpy.called, 'Event was fired.' ).to.be.false
            done()


      describe 'Library tab', ->

        before ->
          @dd.open()
          @dd.holder.find('.ui-tabs').tabs({ active: 0 })

        after ->

        it 'is active', ->
          expect( @dd.holder.find('.ui-tabs-nav .ui-state-active').text() ).to.have.string 'Library'


        describe 'insert success', ->

          before ->
            @return_obj =
              "grid":"/refinery/test/fixtures/img.png"
              "id":1
              "large":"/refinery/test/fixtures/img.png"
              "medium":"/refinery/test/fixtures/img.png"
              "original":"/refinery/test/fixtures/img.png"
              "size": "original"
              "small":"/refinery/test/fixtures/img.png"
              "type":"library"

            @eventSpy = sinon.spy()
            @dd.on 'insert', @eventSpy

          after ->

          it 'return img object', (done) ->
            @dd.holder.find('.button.insert-button:visible').click()

            expect( @eventSpy.called, 'Event insert did not fire.' ).to.be.true
            expect( @eventSpy.calledOnce, 'Event fired more than once' ).to.be.true
            expect( @eventSpy.calledWith( @return_obj ), 'Retturned object should be: \n' + JSON.stringify(@return_obj) ).to.be.true
            done()


        describe 'insert fail', ->

          before ->
            @dd.open()
            @eventSpy = sinon.spy()
            @dd.on 'insert', @eventSpy

          after ->
            @dd.close()

          it 'not fire insert event when image is not selected', (done) ->
            @dd.holder.find('#image-1').click()
            @dd.holder.find('.button.insert-button:visible').click()

            expect( @eventSpy.called, 'Event insert was fired.' ).to.be.false
            done()


        describe 'pagination', ->

          before ->
            @dd.open()
            @eventSpy = sinon.spy()
            @dd.on 'insert', @eventSpy

          after ->
            @dd.close()

          # todo
          it 'not fire insert event when image is not selected', (done) ->
            @dd.holder.find('.pagination a').first().click()
#            #expect( @eventSpy.called, 'Event insert was fired.' ).to.be.false
            done()
