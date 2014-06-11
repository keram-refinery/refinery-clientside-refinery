refinery.admin.backend_path = () ->
  '/test'

describe 'PageParts', ->
  before (done) ->
    container = $('#container')
    page_parts = refinery('admin.FormPageParts')
    $.get '/test/fixtures/page_new_parts_default.html', (response) ->
      container.html(response)
      page_parts.init($('#page_parts'))
      done()

    @page_parts = page_parts
    @container = container

  after ->
    @page_parts.destroy()
    @container.empty()

  describe 'open close dialog', ->
    it 'has openable dialog', ->
      $('#page_parts-options').click()
      expect( $('.ui-dialog').is(':visible') ).to.be.true

    it 'has openable dialog', ->
      $('#page_parts-options').click()
      $('.ui-dialog-titlebar-close').click()
      expect( $('.ui-dialog').is(':visible') ).to.be.false

    after ->
      $('.ui-dialog-titlebar-close').click()

  describe 'activate part', ->
    before (done) ->
      $('#page_parts-options').click()
      $('.ui-dialog li[data-part="perex"] input').prop('checked', true)
      $('.ui-dialog .ui-dialog-buttonset button').click()
      done()

    after (done) ->
      $('#page_parts-options').click()
      $('.ui-dialog li[data-part="perex"] input').prop('checked', false)
      $('.ui-dialog .ui-dialog-buttonset button').click()
      done()

    it 'show perex tab', ->
      expect( @container.find('.ui-tabs-nav li[aria-controls="page_part_perex"]').hasClass('js-hide') ).to.be.false

  describe 'deactivate part', ->
    before (done) ->
      $('#page-parts-options').click()
      $('.ui-dialog li[data-part="body"] input').prop('checked', false)
      $('.ui-dialog li[data-part="perex"] input').prop('checked', true)
      $('.ui-dialog .ui-dialog-buttonset button').click()
      done()

    after ->
      $('#page-parts-options').click()
      $('.ui-dialog li[data-part="body"] input').prop('checked', true)
      $('.ui-dialog li[data-part="perex"] input').prop('checked', false)
      $('.ui-dialog .ui-dialog-buttonset button').click()

    it 'hide body tab', ->
      expect( @container.find('.ui-tabs-nav li[aria-controls="page_part_body"]').hasClass('js-hide') ).to.be.true

    it 'activate another tab', ->
      expect( @container.find('.ui-tabs-nav .ui-tabs-active').hasClass('js-hide') ).to.be.false

  describe 'reorder parts', ->
    before ->
      $('#page-parts-options').click()
      body_li = $($('.ui-dialog li[data-part="body"]')).detach()
      $('.ui-dialog .records').append(body_li)
      $('.ui-dialog .ui-dialog-buttonset button').click()

    it 'move body tab to end of list', ->
      expect( @container.find('.ui-tabs-nav a').last().attr('href') ).to.be.eq(
        @container.find('.ui-tabs-nav a[href="#page_part_body"]').attr('href')
      )
