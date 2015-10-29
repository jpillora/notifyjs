
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

  #show gswg ad
  $.notify.addStyle 'gswg',
    html: """<div>
      <div class="content clearfix">
        <div class="cover"></div>
        <div class="text">
          <div>Checkout</div>
          <div class="title">Getting Started with Grunt: The JavaScript Task Runner</div>
          <div>Get the first chapter for free!</div>
          <div>
            <a target="_blank" href="http://gswg.io">
              <button data-notify-text></button>
            </a>
            <button>No thanks</button>
          </div>
        </div>
      </div>
    </div>
    """

  $(document).on 'click', '.notifyjs-gswg-base button', ->
    $(this).trigger('notify-hide')

  setTimeout ->
    $.notify("http://gswg.io", {position:'b r', style: 'gswg', autoHideDelay: 10*1000, clickToHide: false})
  , 15*1000
