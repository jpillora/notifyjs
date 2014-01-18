
App = App or {}

App.init = ->

  $.notify.defaults
    className: 'success'

  App.codeRunner()
  App.posChooser()

  # download links
  $(document).on 'click', "a[data-download]", (e) ->
    if $.compile
      url = $(@).attr 'href'
      name = $(@).attr('data-name') || 'lib'
      $.compile.fetch(name, url).download(name)
      ga 'send', 'event', 'download', name
      e.preventDefault()
      return false
    return true

  mouseDemo = $ ".demo-mouse"
  $('.summary').hover ->
    mouseDemo.addClass "over"
  , ->
    mouseDemo.removeClass "over"

$ App.init