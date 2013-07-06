refinery.admin.ImagesDialog.prototype.options.url = '/refinery/test/fixtures/images_dialog.json'
refinery.admin.ResourcesDialog.prototype.options.url = '/refinery/test/fixtures/resources_dialog.json'
refinery.admin.LinksDialog.prototype.options.url = '/refinery/test/fixtures/links_dialog.json'


describe 'PageParts', ->

  before (done) ->
    container = $('#container')
    ui = new refinery.admin.UserInterface();
    $.get('../fixtures/page_new_parts_default.html', (response) ->
      container.html(response)
      ui.init(container)
      done()
    )

    @ui = ui
    @container = container

  after ->
    @container.empty()

  describe 'add part', ->
    before (done) ->
      @getJSONstub = sinon.stub($, 'getJSON')

      @errorResponse = () ->
        d = $.Deferred()
        d.reject({}, 404, 'something went wrong')
        d.promise()

      @okResponse = () ->
        d = $.Deferred()
        d.resolve(
          {"html":["\u003Cdiv class=\"page-part\" id=\"page_part_lorem\"\u003E\n  \u003Clabel class=\"js-hide\" for=\"page_parts_attributes_2_body\"\u003Elorem\u003C/label\u003E\n  \u003Cinput class=\"part-title\" id=\"page_parts_attributes_2_title\" name=\"page[parts_attributes][2][title]\" type=\"hidden\" value=\"lorem\" /\u003E\n  \u003Ctextarea class=\"replace-with-editor\" id=\"page_parts_attributes_2_body\" name=\"page[parts_attributes][2][body]\" \u003E\n\u003C/textarea\u003E\n  \u003Cinput class=\"part-position\" id=\"page_parts_attributes_2_position\" name=\"page[parts_attributes][2][position]\" type=\"hidden\" value=\"2\" /\u003E\n\u003C/div\u003E\n"]},
          'success',
          {
            getResponseHeader: (args) ->
              false
          }
        )
        done()
        d.promise()

      @getJSONstub.returns(@okResponse())
      $('#add-page-part').click()
      $('#new-page-part-title').val('lorem')
      $('.ui-dialog .submit-button').click()

    after ->
      $.getJSON.restore()


    it 'add tab to navigation', ->
      expect( $('#page-parts').html() ).to.have.string('lorem')

    it 'tab is selected', ->
      expect( $('#page-parts .ui-state-active').html() ).to.have.string('lorem')

    it 'add panel for body part', ->
      expect( $('#page_part_lorem').length ).to.be.equal(1)

  describe 'add multiple parts', ->
    before ->
      @getJSONstub = sinon.stub($, 'getJSON')

      @i = 1

      @okResponse = (html) ->
        d = $.Deferred()
        d.resolve(
          {"html":[html]},
          'success',
          {
            getResponseHeader: (args) ->
              false
          }
        )
        d.promise()

      @i = 1
      while @i <= 5
        part = 'lorem' + @i
        html = "\u003Cdiv class=\"page-part\" id=\"page_part_" + part + "\"\u003E\n  \u003Clabel class=\"js-hide\" for=\"page_parts_attributes_" + @i + "_body\"\u003E" + part + "\u003C/label\u003E\n  \u003Cinput class=\"part-title\" id=\"page_parts_attributes_" + @i + "_title\" name=\"page[parts_attributes][" + @i + "][title]\" type=\"hidden\" value=\"" + part + "\" /\u003E\n  \u003Ctextarea class=\"replace-with-editor\" id=\"page_parts_attributes_" + @i + "_body\" name=\"page[parts_attributes][" + @i + "][body]\" \u003E\n\u003C/textarea\u003E\n  \u003Cinput class=\"part-position\" id=\"page_parts_attributes_" + @i + "_position\" name=\"page[parts_attributes][" + @i + "][position]\" type=\"hidden\" value=\"" + @i + "\" /\u003E\n\u003C/div\u003E\n"
        @getJSONstub.returns(@okResponse(html))
        $('#add-page-part').click()
        $('#new-page-part-title').val(part)
        $('.ui-dialog .submit-button').click()
        @i++

    after ->
      $.getJSON.restore()

      sinon.stub(window, 'confirm').returns(true)
      j = 1
      while j < @i
        $('a[href="#page_part_lorem' + j + '"]').click()
        $('#delete-page-part').click()
        j++

      window.confirm.restore()

    it 'add tabs to navigation', ->
      j = 1
      while j < @i
        expect( $('#page-parts').text() ).to.have.string('lorem' + j)
        j++

    it 'add panels for body part', ->
      j = 1
      while j < @i
        expect( $('#page_part_lorem' + j).length ).to.be.equal(1)
        j++


  describe 'delete part', ->
    before ->
      sinon.stub(window, 'confirm').returns(true)
      $('a[href="#page_part_lorem"]').click()
      $('#delete-page-part').click()

    after ->
      window.confirm.restore()

    it 'update parts position', ->
      $('input.part-position').each( (i) ->
        expect( $(this).val() * 1 ).to.be.equal(i)
      )
# todo
# don't know emulate drag'n drop for sortable tabs
#  describe 'resort parts', ->
#    before ->
#      @li1 = $('#page-parts').find("li:eq(1)")
#      a = @li1.find('a')
#      @positionBefore = $(a.attr('href')).find('input.part-position').val()
#      $('#reorder-page-part').click()
#      a.click()
#      @li1.draggable({ cancel: '' })
#      @li1.simulate( 'drag',
#        dx: -200,
#        dy: 0
#      )
#      $('#reorder-page-part-done').click()
#      @li1.draggable('destroy')
#      @positionAfter = $(a.attr('href')).find('input.part-position').val()
#
#    after ->
#
#    it 'update parts position', ->
#      $('input.part-position').each( (i) ->
#        expect( $(this).val() * 1 ).to.be.equal(i)
#      )
#
