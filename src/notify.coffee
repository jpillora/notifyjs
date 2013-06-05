
'use strict'

#plugin constants
pluginName = 'notify'
pluginClassName = pluginName+'js'

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

    # <div class="#{pluginClassName}Debug"></div>

    # .#{pluginClassName}Debug {
    #   position: absolute;
    #   border: 3px solid red;
    #   height: 0;
    #   width: 0;
    # }

  css: """
    .#{pluginClassName}-corner {
      position: fixed;
      top: 0;
      right: 0;
      margin: 5px;
      z-index: 1050;
    }

    .#{pluginClassName}-corner .#{pluginClassName}-wrapper,
    .#{pluginClassName}-corner .#{pluginClassName}-container {
      position: relative;
      display: block;
      height: inherit;
      width: inherit;
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
      cursor: pointer;
    }

    .#{pluginClassName}-text {
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

addStyle = (name, def) ->
  if styles[name]
    if window.console
      console.warn "#{pluginName}: overwriting style '#{name}'"
    $("#notify-#{name}").remove()

  def.name = name
  styles[name] = def

  return if def.cssElem

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

  return unless cssText
  def.cssElem = insertCSS cssText
  def.cssElem.attr('id', "notify-#{def.name}")

insertCSS = (cssText) ->

  elem = createElem("style")
  $("head").append elem
  try
    elem.html cssText
  catch e #ie fix
    elem[0].styleSheet.cssText = cssText
  elem


# ================================
#  OPTIONS
# ================================

#overridable options
pluginOptions =
  autoHide: true
  autoHideDelay: 5000
  arrowShow: true
  arrowSize: 5
  elementPosition: 'bottom'
  globalPosition: 'top right'
  # Default style
  style: 'bootstrap'
  className: 'error'
  showAnimation: 'slideDown'
  showDuration: 400
  hideAnimation: 'slideUp'
  hideDuration: 200
  # Gap between main and element
  offsetY: 0
  offsetX: 0
  #TODO add z-index watches
  #parents:  { '.ui-dialog': 5001 }

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

# container for element-less notifications
cornerElem = createElem("div").addClass("#{pluginClassName}-corner")

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
    val *= -1

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


# ================================
#  NOTIFY CLASS
# ================================

#define plugin
class Notification

  #setup instance variables
  constructor: (elem, data, options) ->
    options = {className: options} if typeof options is 'string'
    @options = inherit pluginOptions, if $.isPlainObject(options) then options else {}

    #load user html into @userContainer
    @loadHTML()

    @wrapper = $(coreStyle.html)
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
    else
      # @options.autoHide = true
      @options.arrowShow = false
      cornerElem.prepend @wrapper

    @container.hide()
    @run(data)

  loadHTML: ->
    style = @getStyle()
    @userContainer = $(style.html)
    @text = @userContainer.find '[data-notify-text]'
    if @text.length is 0
      @text = @userContainer.find '[data-notify-html]'
      @rawHTML = true
    if @text.length is 0
      throw "style: '#{name}' HTML is missing a: 'data-notify-text' or 'data-notify-html' attribute"

    @text.addClass "#{pluginClassName}-text"

  show: (show, callback = $.noop) ->

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

  updatePosition: ->
    return unless @elem

    #grab some dimensions
    elemPos = @elem.position()
    elemH = @elem.outerHeight()
    elemW = @elem.outerWidth()
    elemIH = @elem.innerHeight()
    elemIW = @elem.innerWidth()
    wrapPos = @wrapper.position()
    contH = @container.height()
    contW = @container.width()

    #get user defined position
    position = @getPosition()

    pMain  = position[0]
    pAlign = position[1]
    pArrow = position[2] or pAlign

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
    #   incr css, 'top', (elemPos.top - wrapPos.top)
    incr css, 'left', elemPos.left - wrapPos.left

    #correct for left margin
    margin = parseInt @elem.css("margin-left"), 10
    incr css, 'left', margin if margin
    #correct for inline top padding
    if /^inline/.test @elem.css('display')
      padding = parseInt @elem.css("padding-top"), 10
      incr css, 'top', -padding if padding
    #user defined offset
    incr css, 'top', @options.offsetY
    incr css, 'left', @options.offsetX

    style = @getStyle()

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

    unless @options.autoReposition
      return pos

    # if @elem.position().left + @elem.width() + @wrapper.width() < $(window).width()
    #   return 'right'
    # return 'bottom'
    throw "Not implemented"

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
      @options.color = options

    if @container and not data
      @show false
      return
    else if not @container and not data
      return

    #update content
    if $.type(data) is 'string'
      @text[if @rawHTML then 'html' else 'text'](data)
    else
      @text.empty().append(data)

    #set styles
    @updateClasses()

    #position
    @updatePosition()

    @show true

    #autohide
    if @options.autoHide
      clearTimeout @autohideTimer
      @autohideTimer = setTimeout =>
        @show false
      , @options.autoHideDelay

  destroy: ->
    @show false, =>
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

#extra
$.extend $[pluginName], { defaults, addStyle }

#when ready
$ ->
  #corner notification container
  $("body").append cornerElem

  #auto-detect bootstrap
  $("link").each ->
    src =  $(@).attr 'href'
    if src.match /bootstrap/
      bootstrapDetected = true
      return false

  #insert default style
  insertCSS(coreStyle.css).attr('data-notify-style', 'core')

  #watch all notifications clicks
  $(document).on 'click', ".#{pluginClassName}-wrapper", ->
    inst = $(@).data pluginClassName
    return unless inst
    if inst.elem
      inst.show false
    else
      inst.destroy()

