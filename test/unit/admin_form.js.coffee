describe 'refinery.admin.Form', ->
  before ->
    @form = new refinery.admin.Form()

  after ->
    @form.destroy()

  it 'is instance of refinery.Object', ->
    expect( @form ).to.be.an.instanceof(refinery.Object)

