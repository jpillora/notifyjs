
'use strict'

#plugin constants
pluginName = 'notify'
className = '__'+pluginName

#opposites
arrowDirs =
  top: 'bottom'
  bottom: 'top'
  left: 'right'
  right: 'left'
  middle: null
  center: null

styles =
  core:
    html: """
      <div class="#{className}Wrapper">
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
        opacity: 0.85;
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
        margin-top: #{2 + (if document.documentMode is 5 then (size*-4) else 0)}px;
        position: absolute;
        z-index: 2;
        margin-left: 10px;
        width: 0;
        height: 0;
      }

    """
  user:
    default:
      html: """
        <div class="#{className}Default" 
             data-notify-style="
              color: {{color}}; 
              border-color: {{color}};
             ">
           <span data-notify="text"></span>
         </div>
      """
      css: """
        .#{className}Default {
          background: #fff;
          font-size: 11px;
          box-shadow: 0 0 6px #000;
          -moz-box-shadow: 0 0 6px #000;
          -webkit-box-shadow: 0 0 6px #000;
          padding: 4px 10px 4px 8px;
          border-radius: 6px;
          border-style: solid;
          border-width: 2px;
          -moz-border-radius: 6px;
          -webkit-border-radius: 6px;
          white-space: nowrap;
        }
      """

    bootstrap: 
      html: """
        <div class="alert alert-error #{className}Bootstrap">
          <strong data-notify="text"></strong>
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


bootstrapDetected = false
#overridable options
pluginOptions =
  autoHide: false
  autoHideDelay: 2000
  arrowShow: false
  arrowSize: 5
  position: 'bottom'
  # Default style
  style: null
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
  offsetY: 2
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

insertCSS = (style) ->
  return unless style and style.css
  elem = style.cssElem
  unless elem
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
    @text = @userContainer.find '[data-notify=text]'
    if @text.length is 0
      throw "style: #{name} HTML is missing the: data-notify='text' attribute"
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

    args.push callback

    elems[fn].apply elems, args 

  updatePosition: ->
    return unless @elem
    #
    elementPosition = @elem.position()
    mainPosition = @wrapper.position()
    
    #
    position = @getPosition()

    #start calculations
    p =
      top: 0
      left: 0
    switch position
      when 'bottom'
        p.top += @elem.outerHeight()
      when 'right'
        p.left += @elem.width()
      else
        throw "Unknown position: #{position}"

    #elem vs wrapper corrections
    p.top += (elementPosition.top - mainPosition.top)  unless navigator.userAgent.match /MSIE/
    p.left += elementPosition.left - mainPosition.left
    
    #set user offset
    p.top += @options.offsetY
    p.left += @options.offsetX

    @updateArrow p, position

    # if @setCSS
    #   @container.stop().animate(p)
    # else
    @container.css p
    # @setCSS = true

  updateArrow: (p, position) ->

    unless @options.arrowShow and @elementType isnt 'radio'
      @arrow.hide()
      return 

    dir = arrowDirs[position]
    size = @options.arrowSize

    @arrow.css 'border-' + position, size + 'px solid ' + @getColor()
    @arrow.css p
    for d of arrowDirs
      if d isnt dir and d isnt position
        @arrow.css 'border-' + d, size + 'px solid transparent'  

    switch position
      when 'bottom'
        p.top += size
      when 'right'
        p.left += size

    @arrow.show()

  getPosition: ->
    return @options.position if @options.position
    if @elem.position().left + @elem.width() + @wrapper.width() < $(window).width()
      return 'right'
    return 'bottom'

  getColor: ->
    styleColors = @getStyle().colors
    return (styleColors and
            styleColors[@options.color]) or
           @options.colors[@options.color] or 
           @options.color

  getStyle: (name) ->
    name = @options.style unless name
    name = 'bootstrap' if bootstrapDetected and not name
    name = 'default' unless name
    style = styles.user[name]
    throw "Missing style: #{name}" unless style
    style

  updateStyle: ->
    #update colors
    @wrapper.find('[data-notify-style]').each (i,e) =>
      $(e).attr 'style', $(e).attr('data-notify-style').
        replace(/\{\{\s*color\s*\}\}/ig, @getColor()).
        replace(/\{\{\s*position\s*\}\}/ig, @getPosition())

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
      autohideTimer = setTimeout =>
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

# publicise methods
$[pluginName].options = (options) ->
  $.extend pluginOptions, options

$[pluginName].styles = (s) ->
  $.extend true, styles.user, s

# $( ... ).pluginName( { .. } ) creates a cached instance on each
$.fn[pluginName] = (data, options) ->
  $(@).each ->
    inst = getAnchorElement($(@)).data className
    if inst
      inst.run data, options
    else
      new Notification $(@), data, options

