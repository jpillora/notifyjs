
'use strict'

#plugin constants
pluginName = 'notify'
pluginClassName = pluginName+'js'
blankFieldName = pluginName+"!blank"

# ================================
#  POSITIONING
# ================================

positions =
  t: 'top'
  m: 'middle'
  b: 'bottom'
  l: 'left'
  c: 'center'
  r: 'right'
hAligns = ['l','c','r']
vAligns = ['t','m','b']
mainPositions = ['t','b','l','r']
#positions mapped to opposites
opposites =
  t: 'b'
  m: null
  b: 't'
  l: 'r'
  c: null
  r: 'l'

parsePosition = (str) ->
  pos = []
  $.each str.split(/\W+/), (i,word) ->
    w = word.toLowerCase().charAt(0)
    pos.push w if positions[w]
  pos

# ================================
#  STYLES
# ================================
styles = {}

coreStyle =
  name: 'core'
  html: """
    <div class="#{pluginClassName}-wrapper">
      <div class="#{pluginClassName}-arrow"></div>
      <div class="#{pluginClassName}-container"></div>
    </div>
  """
    #   <div class="#{pluginClassName}-debug"></div>
    # .#{pluginClassName}-debug {
    #   position: absolute;
    #   border: 3px solid red;
    #   height: 0;
    #   width: 0;
    # }
  css: """
    .#{pluginClassName}-corner {
      position: fixed;
      margin: 5px;
      z-index: 1050;
    }

    .#{pluginClassName}-corner .#{pluginClassName}-wrapper,
    .#{pluginClassName}-corner .#{pluginClassName}-container {
      position: relative;
      display: block;
      height: inherit;
      width: inherit;
      margin: 3px;
    }

    .#{pluginClassName}-wrapper {
      z-index: 1;
      position: absolute;
      display: inline-block;
      height: 0;
      width: 0;
    }

    .#{pluginClassName}-container {
      display: none;
      z-index: 1;
      position: absolute;
    }

    .#{pluginClassName}-hidable {
      cursor: pointer;
    }

    [data-notify-text],[data-notify-html] {
      position: relative;
    }

    .#{pluginClassName}-arrow {
      position: absolute;
      z-index: 2;
      width: 0;
      height: 0;
    }
  """

stylePrefixes =
  "border-radius": ["-webkit-", "-moz-"]

getStyle = (name) ->
  styles[name]

addStyle = (name, def) ->

  unless name
    throw "Missing Style name"
  unless def
    throw "Missing Style definition"
  unless def.html
    throw "Missing Style HTML"

  if styles[name]?.cssElem
    if window.console
      console.warn "#{pluginName}: overwriting style '#{name}'"
    styles[name].cssElem.remove()

  def.name = name
  styles[name] = def

  cssText = ""
  if def.classes
    $.each def.classes, (className, props) ->
      cssText += ".#{pluginClassName}-#{def.name}-#{className} {\n"
      $.each props, (name, val) ->
        #vendor prefixes
        if stylePrefixes[name]
          $.each stylePrefixes[name], (i, prefix) ->
            cssText += "  #{prefix}#{name}: #{val};\n"
        #add prop
        cssText += "  #{name}: #{val};\n"
      cssText += "}\n"
  if def.css
    cssText += """
      /* styles for #{def.name} */
      #{def.css}
    """

  if cssText
    def.cssElem = insertCSS cssText
    def.cssElem.attr('id', "notify-#{def.name}")

  #precompute usable text fields
  fields = {}
  elem = $(def.html)
  findFields 'html', elem, fields
  findFields 'text', elem, fields
  def.fields = fields

insertCSS = (cssText) ->

  elem = createElem("style")
  elem.attr 'type', 'text/css'
  $("head").append elem
  try
    elem.html cssText
  catch e #ie fix
    elem[0].styleSheet.cssText = cssText
  elem

# style.html helper
findFields = (type, elem, fields) ->
  type = 'text' if type isnt 'html'
  attr = "data-notify-#{type}"
  find(elem,"[#{attr}]").each ->
    name = $(@).attr attr
    name = blankFieldName unless name
    fields[name] = type

find = (elem, selector) ->
  if elem.is(selector) then elem else elem.find selector

# ================================
#  OPTIONS
# ================================

#overridable options
pluginOptions =
  clickToHide: true
  autoHide: true
  autoHideDelay: 5000
  arrowShow: true
  arrowSize: 5
  breakNewLines: true
  # autoReposition: true
  elementPosition: 'bottom'
  globalPosition: 'top right'
  style: 'bootstrap'
  className: 'error'
  showAnimation: 'slideDown'
  showDuration: 400
  hideAnimation: 'slideUp'
  hideDuration: 200
  gap: 5

inherit = (a, b) ->
  F = () ->
  F.prototype = a
  $.extend true, new F(), b

defaults = (opts) ->
  $.extend pluginOptions, opts

# ================================
#  DOM MANIPULATION
# ================================

# plugin helpers
createElem = (tag) ->
  $ "<#{tag}></#{tag}>"

# references to global anchor positions
globalAnchors = {}

#gets first on n radios, and gets the fancy stylised input for hidden inputs
getAnchorElement = (element) ->
  #choose the first of n radios
  if element.is('[type=radio]')
    radios = element.parents('form:first').find('[type=radio]').filter (i, e) ->
      $(e).attr('name') is element.attr('name')
    element = radios.first()
  #custom-styled inputs - find thier real element
  element

incr = (obj, pos, val) ->
  # console.log "incr ---- #{pos} #{val} (#{typeof val})"
  if typeof val is 'string'
    val = parseInt val, 10
  else if typeof val isnt 'number'
    return

  return if isNaN val

  opp = positions[opposites[pos.charAt(0)]]
  temp = pos

  #use the opposite if exists
  if obj[opp] isnt `undefined`
    pos = positions[opp.charAt(0)]
    val = -val

  if obj[pos] is `undefined`
    obj[pos] = val
  else
    obj[pos] += val
  null

realign = (alignment, inner, outer) ->
  return if alignment in ['l','t']
    0
  else if alignment in ['c','m']
    outer/2 - inner/2
  else if alignment in ['r','b']
    outer - inner
  throw "Invalid alignment"

encode = (text) ->
  encode.e = encode.e or createElem "div"
  encode.e.text(text).html()

# ================================
#  NOTIFY CLASS
# ================================

#define plugin
class Notification

  #setup instance variables
  constructor: (elem, data, options) ->
    options = {className: options} if typeof options is 'string'
    @options = inherit pluginOptions, if $.isPlainObject(options) then options else {}

    #load style html into @userContainer
    @loadHTML()

    @wrapper = $(coreStyle.html)
    @wrapper.addClass "#{pluginClassName}-hidable" if @options.clickToHide
    @wrapper.data pluginClassName, @
    @arrow = @wrapper.find ".#{pluginClassName}-arrow"
    @container = @wrapper.find ".#{pluginClassName}-container"
    @container.append @userContainer

    if elem and elem.length
      @elementType = elem.attr('type')
      @originalElement = elem
      @elem = getAnchorElement(elem)
      @elem.data pluginClassName, @
      # add into dom above elem
      @elem.before @wrapper

    @container.hide()
    @run(data)

  loadHTML: ->
    style = @getStyle()
    @userContainer = $(style.html)
    @userFields = style.fields

  show: (show, userCallback) ->

    callback = =>
      @destroy() if not show and not @elem
      userCallback() if userCallback

    hidden = @container.parent().parents(':hidden').length > 0

    elems = @container.add @arrow
    args = []

    if hidden and show
      fn = 'show'
    else if hidden and not show
      fn = 'hide'
    else if not hidden and show
      fn = @options.showAnimation
      args.push @options.showDuration
    else if not hidden and not show
      fn = @options.hideAnimation
      args.push @options.hideDuration
    else
      return callback()

    args.push callback

    elems[fn].apply elems, args


  setGlobalPosition: () ->
    [pMain, pAlign] = @getPosition()

    main = positions[pMain]
    align = positions[pAlign]

    key = pMain+"|"+pAlign
    anchor = globalAnchors[key]
    unless anchor
      anchor = globalAnchors[key] = createElem("div")
      css = {}
      css[main] = 0
      if align is 'middle'
        css.top = '45%'
      else if align is 'center'
        css.left = '45%'
      else
        css[align] = 0
      anchor.css(css).addClass("#{pluginClassName}-corner")
      $("body").append anchor

    anchor.prepend @wrapper

  setElementPosition: () ->
    position = @getPosition()

    [pMain, pAlign, pArrow] = position

    #grab some dimensions
    elemPos = @elem.position()
    elemH = @elem.outerHeight()
    elemW = @elem.outerWidth()
    elemIH = @elem.innerHeight()
    elemIW = @elem.innerWidth()
    wrapPos = @wrapper.position()
    contH = @container.height()
    contW = @container.width()


    #start calculations
    mainFull = positions[pMain]
    opp = opposites[pMain]
    oppFull = positions[opp]
    #initial positioning
    css = {}
    css[oppFull] = if pMain is 'b'
      elemH
    else if pMain is 'r'
      elemW
    else
      0

    #correct for elem-wrapper offset
    # unless navigator.userAgent.match /MSIE/
    incr css, 'top', elemPos.top - wrapPos.top
    incr css, 'left', elemPos.left - wrapPos.left

    #correct for margins
    for pos in ['top', 'left']
      margin = parseInt @elem.css("margin-#{pos}"), 10
      incr css, pos, margin if margin
      #correct for paddings (only for inline)
      # if /^inline/.test @elem.css('display')
      #   padding = parseInt @elem.css("padding-#{pos}"), 10
      #   incr css, pos, -padding if padding

    #add gap
    gap = Math.max 0, @options.gap - if @options.arrowShow then arrowSize else 0
    incr css, oppFull, gap

    #calculate arrow
    if not @options.arrowShow
      @arrow.hide()
    else
      arrowSize = @options.arrowSize
      arrowCss = $.extend {}, css
      arrowColor = @userContainer.css("border-color") or
                   @userContainer.css("background-color") or
                   'white'
      #build arrow
      for pos in mainPositions
        posFull = positions[pos]
        continue if pos is opp
        color = if posFull is mainFull then arrowColor else 'transparent'
        arrowCss["border-#{posFull}"] = "#{arrowSize}px solid #{color}"
      #add some room for the arrow
      incr css, positions[opp], arrowSize
      incr arrowCss, positions[pAlign], arrowSize*2 if pAlign in mainPositions

    #calculate container alignment
    if pMain in vAligns
      incr css, 'left', realign(pAlign, contW, elemW)
      incr arrowCss, 'left', realign(pAlign, arrowSize, elemIW) if arrowCss
    else if pMain in hAligns
      incr css, 'top', realign(pAlign, contH, elemH)
      incr arrowCss, 'top', realign(pAlign, arrowSize, elemIH) if arrowCss

    css.display = 'block' if @container.is(":visible")
    #apply css
    @container.removeAttr('style').css css
    @arrow.removeAttr('style').css(arrowCss) if arrowCss

  getPosition: ->

    text = @options.position or if @elem then @options.elementPosition else @options.globalPosition
    
    pos = parsePosition text

    #validate position
    pos[0] = 'b' if pos.length is 0
    if pos[0] not in mainPositions
      throw "Must be one of [#{mainPositions}]"

    #validate alignment
    if pos.length is 1 or
       (pos[0] in vAligns and pos[1] not in hAligns) or
       (pos[0] in hAligns and pos[1] not in vAligns)
      pos[1] = if pos[0] in hAligns then 'm' else 'l'

    if pos.length is 2
      pos[2] = pos[1]

    return pos

  getStyle: (name) ->
    name = @options.style unless name
    name = 'default' unless name
    style = styles[name]
    throw "Missing style: #{name}"unless style
    style

  updateClasses: ->
    classes = ['base']

    if $.isArray @options.className
      classes = classes.concat @options.className
    else if @options.className
      classes.push @options.className

    style = @getStyle()
    classes = $.map(classes, (n) -> "#{pluginClassName}-#{style.name}-#{n}").join ' '

    @userContainer.attr 'class', classes

  #run plugin
  run: (data, options) ->
    #update options
    if $.isPlainObject(options)
      $.extend @options, options
    #shortcut special case
    else if $.type(options) is 'string'
      @options.className = options

    if @container and not data
      @show false
      return
    else if not @container and not data
      return

    datas = {}
    if $.isPlainObject data
      datas = data
    else
      datas[blankFieldName] = data

    for name, d of datas
      type = @userFields[name]
      continue unless type
      if type is 'text'
        #escape
        d = encode(d)
        d = d.replace(/\n/g,'<br/>') if @options.breakNewLines
      #update content
      value = if name is blankFieldName then '' else '='+name
      find(@userContainer,"[data-notify-#{type}#{value}]").html(d)

    #set styles
    @updateClasses()

    #positioning
    if @elem
      @setElementPosition()
    else
      @setGlobalPosition()

    @show true

    #autohide
    if @options.autoHide
      clearTimeout @autohideTimer
      @autohideTimer = setTimeout =>
        @show false
      , @options.autoHideDelay

  destroy: ->
    @wrapper.remove()


# ================================
#  API
# ================================

# $.pluginName( { ...  } ) changes options for all instances
$[pluginName] = (elem, data, options) ->
  if (elem and elem.nodeName) or elem.jquery
    $(elem)[pluginName](data, options)
  else
    options = data
    data = elem
    new Notification null, data, options
  elem

# $( ... ).pluginName( { .. } ) creates a cached instance on each
$.fn[pluginName] = (data, options) ->
  $(@).each ->
    inst = getAnchorElement($(@)).data(pluginClassName)
    if inst
      inst.run data, options
    else
      new Notification $(@), data, options
  @

#extra methods
$.extend $[pluginName], { defaults, addStyle, pluginOptions, getStyle, insertCSS }

#when ready
$ ->
  #insert default style
  insertCSS(coreStyle.css).attr('id', 'core-notify')

  #watch all notifications clicks
  $(document).on 'click', ".#{pluginClassName}-hidable", (e) ->
    $(@).trigger 'notify-hide'

  $(document).on 'notify-hide', ".#{pluginClassName}-wrapper", (e) ->
    $(@).data(pluginClassName)?.show false

