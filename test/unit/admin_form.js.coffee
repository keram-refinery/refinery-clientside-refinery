describe 'refinery.admin.Form', ->
  before ->
    @form = new refinery.admin.Form()

  after ->
    @form.destroy()

  it 'is instance of refinery.Object', ->
    expect( @form ).to.be.an.instanceof(refinery.Object)


  describe 'absolutize_url', ->
    context 'already absolute url', ->
      before ->
        @url = 'http://refinery.sk'
        @new_url = @form.absolutize_url(@url)
        @url2 = 'https://refinery.sk'
        @new_url2 = @form.absolutize_url(@url2)

      it 'url and new_url are the same', ->
        expect( @new_url ).to.be.equal( @url )
        expect( @new_url2 ).to.be.equal( @url2 )

    context 'relative url', ->
      before ->
        @url = '/sk/refinery'
        @new_url = @form.absolutize_url(@url)

      it 'absolutize', ->
        expect( @new_url ).to.be.equal( document.location.origin + @url )

  describe 'get_right_url', ->
    context 'without redirect', ->
      before ->
        @url = 'http://' + document.location.host + '/en'
        @new_url = @form.get_right_url(@url)

        @url2 = '/en'
        @new_url2 = @form.get_right_url( @url2 )

      it 'returns right url', ->
        expect( @new_url ).to.be.equal( @url )
        expect( @new_url2 ).to.be.equal( document.location.origin + @url2 )

    context 'with redirect', ->
      context '/sk/refinery -> /en/refinery', ->
        before ->
          @url = '/sk/refinery'
          @redirect = 'http://' + document.location.host + '/en/something/different'
          @new_url = @form.get_right_url(@url, @redirect )

        it 'returns right url', ->
          expect( @new_url ).to.be.equal( document.location.origin + '/sk/something/different' )

      context '/sk/refinery -> /refinery', ->
        before ->
          @url = '/sk/refinery'
          @redirect = 'http://' + document.location.host + '/something/different'
          @new_url = @form.get_right_url(@url, @redirect )

        it 'returns right url', ->
          expect( @new_url ).to.be.equal( document.location.origin + '/sk/something/different' )

      context '/refinery -> /en/refinery', ->
        before ->
          @url = '/refinery'
          @redirect = 'http://' + document.location.host + '/en/something/different'
          @new_url = @form.get_right_url(@url, @redirect )

        it 'returns right url', ->
          expect( @new_url ).to.be.equal( document.location.origin + '/something/different' )
