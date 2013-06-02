
'use strict'

#plugin constants
pluginName = 'notify'
className = '__'+pluginName


positions =
  t: 'top'
  m: 'middle'
  b: 'bottom'
  l: 'left'
  c: 'center'
  r: 'right'
hPositions = ['l','c','r']
vPositions = ['t','m','b']
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

#built-in styles
styles =
  core:
    html: """
      <div class="#{className}Wrapper">
        <div class="#{className}Debug"></div>
        <div class="#{className}Arrow"></div>
        <div class="#{className}Container"></div>
      </div>
    """
    css: """
      .#{className}Corner {
        position: fixed;
        top: 0;
        right: 0;
        margin: 5px;
        z-index: 1050;
      }

      .#{className}Corner .#{className}Wrapper,
      .#{className}Corner .#{className}Container {
        position: relative;
        display: block;
        height: inherit;
        width: inherit;
      }

      .#{className}Wrapper {
        z-index: 1;
        position: absolute;
        display: inline-block;
        height: 0;
        width: 0;
      }

      .#{className}Debug {
        position: absolute;
        border: 3px solid red;
        height: 0;
        width: 0;
      }

      .#{className}Container {
        display: none;
        z-index: 1;
        position: absolute;
        cursor: pointer;
      }

      .#{className}Text {
        position: relative;
      }

      .#{className}Arrow {
        position: absolute;
        z-index: 2;
        width: 0;
        height: 0;
      }

    """
  user:
    bootstrap:
      html: """
        <div>
           <span data-notify-text></span>
         </div>
      """
      classes:
        base: """
          padding: 8px 35px 8px 14px;
          margin-bottom: 20px;
          text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
          background-color: #fcf8e3;
          border: 1px solid #fbeed5;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          """
        error:
        info:
        warn:

    bootstrap:
      html: """
        <div class="alert alert-error #{className}Bootstrap">
          <strong data-notify-text></strong>
        </div>
      """
      css: """
        .#{className}Bootstrap {
          white-space: nowrap;
          margin: 5px !important;
          padding-left: 25px !important;
          background-repeat: no-repeat;
          background-position: 3px 7px;
          background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtRJREFUeNqkVc1u00AQHq+dOD+0poIQfkIjalW0SEGqRMuRnHos3DjwAH0ArlyQeANOOSMeAA5VjyBxKBQhgSpVUKKQNGloFdw4cWw2jtfMOna6JOUArDTazXi/b3dm55socPqQhFka++aHBsI8GsopRJERNFlY88FCEk9Yiwf8RhgRyaHFQpPHCDmZG5oX2ui2yilkcTT1AcDsbYC1NMAyOi7zTX2Agx7A9luAl88BauiiQ/cJaZQfIpAlngDcvZZMrl8vFPK5+XktrWlx3/ehZ5r9+t6e+WVnp1pxnNIjgBe4/6dAysQc8dsmHwPcW9C0h3fW1hans1ltwJhy0GxK7XZbUlMp5Ww2eyan6+ft/f2FAqXGK4CvQk5HueFz7D6GOZtIrK+srupdx1GRBBqNBtzc2AiMr7nPplRdKhb1q6q6zjFhrklEFOUutoQ50xcX86ZlqaZpQrfbBdu2R6/G19zX6XSgh6RX5ubyHCM8nqSID6ICrGiZjGYYxojEsiw4PDwMSL5VKsC8Yf4VRYFzMzMaxwjlJSlCyAQ9l0CW44PBADzXhe7xMdi9HtTrdYjFYkDQL0cn4Xdq2/EAE+InCnvADTf2eah4Sx9vExQjkqXT6aAERICMewd/UAp/IeYANM2joxt+q5VI+ieq2i0Wg3l6DNzHwTERPgo1ko7XBXj3vdlsT2F+UuhIhYkp7u7CarkcrFOCtR3H5JiwbAIeImjT/YQKKBtGjRFCU5IUgFRe7fF4cCNVIPMYo3VKqxwjyNAXNepuopyqnld602qVsfRpEkkz+GFL1wPj6ySXBpJtWVa5xlhpcyhBNwpZHmtX8AGgfIExo0ZpzkWVTBGiXCSEaHh62/PoR0p/vHaczxXGnj4bSo+G78lELU80h1uogBwWLf5YlsPmgDEd4M236xjm+8nm4IuE/9u+/PH2JXZfbwz4zw1WbO+SQPpXfwG/BBgAhCNZiSb/pOQAAAAASUVORK5CYII=);
        }
      """
      colors:
        red: '#eed3d7'

#overridable options
pluginOptions =
  autoHide: false
  autoHideDelay: 2000
  arrowShow: true
  arrowSize: 5
  position: 'bottom'
  # Default style
  style: 'default'
  # Default color
  color: 'red'
  # Color mappings
  colors:
    red: '#b94a48'
    green: '#33be40'
    black: '#393939'
    blue: '#00f'
  showAnimation: 'slideDown'
  showDuration: 400
  hideAnimation: 'slideUp'
  hideDuration: 200
  # Gap between main and element
  offsetY: 0
  offsetX: 0
  #TODO add z-index watches
  #parents:  { '.ui-dialog': 5001 }

# plugin helpers
createElem = (tag) ->
  $ "<#{tag}></#{tag}>"
inherit = (a, b) ->
  F = () ->
  F.prototype = a
  $.extend true, new F(), b

# container for element-less notifications
cornerElem = createElem("div").addClass("#{className}Corner")

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

insertCSS = (style) ->
  return unless style and style.css
  elem = style.cssElem
  return if elem
  elem = createElem("style")
  $("head").append elem
  style.cssElem = elem

  try
    elem.html style.css
  catch e #ie fix
    elem[0].styleSheet.cssText = style.css

#define plugin
class Notification

  #setup instance variables
  constructor: (elem, data, options) ->
    options = {color: options} if typeof options is 'string'
    @options = inherit pluginOptions, if $.isPlainObject(options) then options else {}

    #load user css into dom
    @loadCSS()
    #load user html into @userContainer
    @loadHTML()

    @wrapper = $(styles.core.html)
    @wrapper.data className, @
    @arrow = @wrapper.find ".#{className}Arrow"
    @container = @wrapper.find ".#{className}Container"
    @container.append @userContainer

    if elem and elem.length
      @elementType = elem.attr('type')
      @originalElement = elem
      @elem = getAnchorElement(elem)
      @elem.data className, @
      # add into dom above elem
      @elem.before @wrapper
    else
      # @options.autoHide = true
      @options.arrowShow = false
      cornerElem.prepend @wrapper

    @container.hide()
    @run(data)

  loadCSS: (style) ->
    unless style
      name = @options.style
      style = @getStyle(name)
    #insert
    insertCSS style

  loadHTML: ->
    style = @getStyle()
    @userContainer = $(style.html)
    @text = @userContainer.find '[data-notify-text]'
    if @text.length is 0
      throw "style: #{name} HTML is missing the: 'data-notify-text' attribute"
    @text.addClass "#{className}Text"

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
    wrapPos = @wrapper.position()
    contH = @container.height()
    contW = @container.width()

    #get user defined position
    position = @getPosition()
    console.log position
    pMain  = position[0]
    pAlign = position[1]
    pArrow = position[2] or pAlign

    #start calculations
    mainFull = positions[pMain]
    opp = opposites[pMain]
    oppFull = positions[opp]
    #initial positioning
    css = {}
    css[oppFull] = if pMain is 'b' then elemH else
                   if pMain is 'r' then elemW else 0

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

    #calculate arrow
    if not @options.arrowShow
      @arrow.hide()
    else
      size = @options.arrowSize
      arrowCss = $.extend {}, css
      #build arrow
      for pos in mainPositions
        posFull = positions[pos]
        continue if pos is opp
        color = if posFull is mainFull then @getColor() else 'transparent'
        arrowCss["border-#{posFull}"] = "#{size}px solid #{color}"
      #add some room for the arrow
      incr css, positions[opp], size
      #add styles
      @arrow.css(arrowCss).show()

    #calculate alignment
    if pMain in vPositions
      incr css, 'left', realign(pAlign, contW, elemW)
    if pMain in hPositions
      incr css, 'top', realign(pAlign, contH, elemH)

    #apply css
    css.display = 'block' if @container.is(":visible")
    @container.removeAttr('style').css css

  getPosition: ->
    text = @options.position
    pos = parsePosition text

    #if unspecified - choose bottom left
    pos[0] = 'b' if pos.length is 0

    if pos[0] not in mainPositions
      throw "Must be one of [#{mainPositions}]"

    if pos.length is 1 or
       (pos[0] in vPositions and pos[1] not in hPositions) or
       (pos[0] in hPositions and pos[1] not in vPositions)
      pos[1] = if pos[0] in hPositions then 'm' else 'l'

    unless @options.autoReposition
      return pos

    # if @elem.position().left + @elem.width() + @wrapper.width() < $(window).width()
    #   return 'right'
    # return 'bottom'

    throw "Not implemented"

  getColor: ->
    styleColors = @getStyle().colors
    return (styleColors and
            styleColors[@options.color]) or
           @options.colors[@options.color] or
           @options.color

  getStyle: (name) ->
    name = @options.style unless name
    name = 'default' unless name
    style = styles.user[name]
    throw "Missing style: #{name}" unless style
    style

  updateStyle: ->
    #update colors
    @wrapper.find('[data-notify-style]').each (i,e) =>
      $(e).attr 'style', $(e).attr('data-notify-style').
        replace(/\{\{\s*color\s*\}\}/ig, @getColor())
        # .
        # replace(/\{\{\s*position\s*\}\}/ig, @getPosition())

  #run plugin
  run: (data, options) ->
    #update options
    if $.isPlainObject(options)
      $.extend @options, options
    #shortcut special case
    else if $.type(options) is 'string'
      @options.color = options

    if @container and not data
      @show false #hide
      return
    else if not @container and not data
      return

    #update content
    if $.type(data) is 'string'
      @text.html data.replace('\n', '<br/>')
    else
      @text.empty().append(data)

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

  #add core styles
  insertCSS styles.core

  #watch all notifications clicks
  $(document).on 'click', ".#{className}Wrapper", ->
    inst = $(@).data className
    return unless inst
    if inst.elem
      inst.show false
    else
      inst.destroy()

# publicise jquery plugin
# return alert "$.#{pluginName} already defined" if $[pluginName]?
# $.pluginName( { ...  } ) changes options for all instances
$[pluginName] = (elem, data, options) ->
  if (elem and elem.nodeName) or elem.jquery
    $(elem)[pluginName](data, options)
  else
    options = data
    data = elem
    new Notification null, data, options
  elem

# publicise methods
$[pluginName].options = (options) ->
  $.extend pluginOptions, options

$[pluginName].styles = (s) ->
  $.extend true, styles.user, s

$[pluginName].insertCSS = insertCSS

# $( ... ).pluginName( { .. } ) creates a cached instance on each
$.fn[pluginName] = (data, options) ->
  $(@).each ->
    inst = getAnchorElement($(@)).data(className)
    if inst
      inst.run data, options
    else
      new Notification $(@), data, options

  @

