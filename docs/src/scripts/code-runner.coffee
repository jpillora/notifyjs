
App = App or {}

App.codeRunner = ->

  prettyPrint()

  addCSS = (e) ->
    pre = $(@)
    $.notify.insertCSS pre.text()

  ranSnippet = false

  runSnippet = (e) ->

    if e and e.type is 'click'
      ranSnippet = true

    pre = $(@)
    pre.addClass 'running'
    eval(pre.text())
    setTimeout ->
      pre.removeClass 'running'
    , 500
    null

  #show tip
  setTimeout ->
    unless ranSnippet
      $.notify('Tip: You can run the code snippets by clicking them', {className:'info', position:'b l'})
  , 30*1000


  $(document).on('click', '.prettyprint.runnable', runSnippet)

  $(".prettyprint.auto-run").each(runSnippet)
  $(".prettyprint.auto-add").each(addCSS)