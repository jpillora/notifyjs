
App = window.App = App or {}

window.BuildController = ($scope,$timeout) ->

  $scope.premadeStyles = [
    { 
      name: "bootstrap"
    }
    {
      name: "metro"
      css: true
      global: true
      test: (text) -> {
        title: 'Email Notification'
        text: 'You received an e-mail from your boss. You should read it right now!'
        image: "<img src='examples/images/Mail.png'/>"
      }
    }
  ]

  $(".build-tool-loading").hide()
  $(".build-tool-toggle").show()

  App.buildTool = $scope

  $scope.settings = {
    minify: false
    default: null
  }

  $scope.styles = []
  $scope.addStyle = (code, premade) ->
    style = { active: true, code, premade:premade }
    $scope.styles.push style
    $scope.settings.default = style unless $scope.settings.default

  $scope.loadStyle = ->
    style = $scope.premadeStyle
    return unless style
    $scope.premadeStyle = null
    baseUrl = "dist/styles/#{style.name}/notify-#{style.name}"

    $.ajax
      url: "#{baseUrl}.js"
      dataType: 'text'
      success: (js) ->
        if style.css
          $.ajax
            url: "#{baseUrl}.css"
            dataType: 'text'
            success: (css) ->
              css = css.replace /(.+)$/mg, '"$1\\n"+'
              $scope.addStyle "#{js}\n$.notify.insertCSS(\n#{css}\"\");", style
              $scope.$digest()
        else
          $scope.addStyle js, style
          $scope.$digest()
    return

  #load bootstrap
  $scope.premadeStyle = $scope.premadeStyles[0]
  $scope.loadStyle()

  #angular has loaded
  $scope.toggle = ->
    $(".build-tool-toggle").toggleClass('active')
    $(".build-tool").toggle(400)

  elem = $(".build-tool-toggle").click $scope.toggle

  $scope.active = (scope, prop) ->
    scope[prop] = !scope[prop]
    # $scope.$digest()

  $scope.useDefault = (style) ->
    $scope.settings.default = style

  $scope.delete = (i) ->
    $scope.styles.splice i,1

  getStyleName = (style) ->
    unless style?.code
      return null
    m = style.code.match /\$\.notify\.addStyle\('(["\w-]+)'/
    unless m
      m = style.code.match /\$\.notify\.addStyle\("(['\w-]+)"/
    unless m
      return null
    m[1]

  $scope.test = (event,style,global) ->

    testBtn = $(event.target)
    contentText = testBtn.parent().parent().find('.code')

    code = style.code

    unless code
      contentText.notify("No code", "error")
      return

    name = getStyleName style

    unless name
      contentText.notify("Style name not found", "error")

    if code isnt style.lastEval
      try
        eval(code)
        style.lastEval = code
      catch e
        contentText.notify(e, "error")
        return

    notifyStyle = $.notify.getStyle name

    unless notifyStyle
      testBtn.notify("No style added", "error")
      return

    classes = Object.keys notifyStyle.classes
    rand = Math.floor Math.random()*classes.length
    className = classes[rand]

    obj = if className is 'base' then 'no class' else "'#{className}'"

    if style.premade?.test
      obj = style.premade.test obj

    try
      if global
        $.notify(obj, {style:name, className })
      else
        testBtn.notify(obj, {style:name, className })
    catch e
      testBtn.notify(e, "error")
      return

  $scope.build = ->
    return if $scope.building
    $scope.building = true
    done = ->
      ga 'send', 'event', 'download', 'notify-custom.js'
      $scope.building = false
      $scope.$digest()

    c = $.compile.
          fetch('core', 'dist/notify.js').
          set('set-defaults', """
            $.notify.defaults({
              style: "#{getStyleName $scope.settings.default}"
            });
          """)

    names = {}
    styles = []
    $.each $scope.styles, (i,s) ->
      return unless s.active
      name = getStyleName s
      return unless name
      if names[name]
        $.notify "Skipping style '#{name}' as it already exists", "warn"
        return
      names[name] = 1
      name = "style-#{i}-#{name}"
      styles.push name
      c.set name, s.code

    c.run('concat',{
        src: ['core','set-defaults'].concat(styles)
        dest: 'result'
      })

    if $scope.settings.minify
      c.run('uglify', {
          src: 'result',
          dest: 'result-min' 
        }).
        download('result-min', 'notify-custom.min.js').
        get('result-min', done)
    else
      c.download('result', 'notify-custom.js').
        get('result', done)


