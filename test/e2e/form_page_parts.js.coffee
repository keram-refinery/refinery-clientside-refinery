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

  describe 'activate part', ->
    before ->
      $('#page-parts-options').click()
      $('.ui-dialog li label').first().click()
      $('.ui-dialog .ui-dialog-buttonset button').click()

    after ->
      $('#page-parts-options').click()
      $('.ui-dialog li label').first().click()
      $('.ui-dialog .ui-dialog-buttonset button').click()

    it 'show perex tab', ->
      expect( $('.ui-tabs-nav a[href="#page_part_perex"]').is(':visible') ).to.be.true

  describe 'deactivate part', ->
    before ->
      $('#page-parts-options').click()
      $('.ui-dialog li label').get(1).click()
      $('.ui-dialog .ui-dialog-buttonset button').click()

    after ->
      $('#page-parts-options').click()
      $('.ui-dialog li label').get(1).click()
      $('.ui-dialog .ui-dialog-buttonset button').click()

    it 'hide body tab', ->
      expect( $('.ui-tabs-nav a[href="#page_part_body"]').is(':visible') ).to.be.false

    it 'activate another tab', ->
      expect( $('.ui-tabs-nav .ui-tabs-active').is(':visible') ).to.be.true

  describe 'reorder parts', ->
    before ->
      $('#page-parts-options').click()
      body_li = $($('.ui-dialog li').get(1)).detach()
      $('.ui-dialog .records').append(body_li)
      $('.ui-dialog .ui-dialog-buttonset button').click()

    after ->
      $('#page-parts-options').click()
      $('.ui-dialog li label').get(1).click()
      $('.ui-dialog .ui-dialog-buttonset button').click()

    it 'move body tab to end of list', ->
      expect( $('.ui-tabs-nav a').last().attr('href') ).to.be.eq(
        $('.ui-tabs-nav a[href="#page_part_body"]').attr('href')
      )
