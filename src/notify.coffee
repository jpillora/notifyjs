
'use strict'

#plugin constants
pluginName = 'notify'
className = '__notify'

arrowDirs =
  top: 'bottom'
  bottom: 'top'
  left: 'right'
  right: 'left'

styles =
  core:
    html: """
      <div class="#{className}Wrapper">
        <div class="#{className}Container">
        </div>
      </div>
    """
    css: """
      .#{className}Wrapper {
        z-index: 1;
        position: absolute;
        display: inline-block;
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
    """
  user:
    default:
      html: """
        <div class="#{className}Default" data-notify-style="color: {{COLOR}}; border-color: {{COLOR}};">
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
        <span>test</span>
      """
      css: """
        body {
          test: 42
        }
      """

#overridable options
pluginOptions =
  autoHidePrompt: false
  autoHideDelay: 10000
  arrowShow: true
  arrowSize: 5
  arrowPosition: 'top'
  # Default style
  style: 'default'
  # Default color
  color: 'red'
  # Color mappings
  colors:
    red: '#ee0101'
    green: '#33be40'
    black: '#393939'
    blue: '#00f'
  showAnimation: 'fadeIn'
  showDuration: 200
  hideAnimation: 'fadeOut'
  hideDuration: 600
  # Gap between main and element
  gap: 2
  #TODO add z-index watches
  #parents:  { '.ui-dialog': 5001 }

# plugin helpers
create = (tag) ->
  $ document.createElement(tag)

# inherit plugin options
Options = (options) -> $.extend @, options
Options:: = pluginOptions

  #gets first on n radios, and gets the fancy stylised input for hidden inputs
getAnchorElement = (element) ->
  #choose the first of n radios
  if element.is('[type=radio]')
    radios = element.parents('form:first').find('[type=radio]').filter (i, e) ->
      $(e).attr('name') is element.attr('name')
    element = radios.first()
  #custom-styled inputs - find thier real element
  fBefore = element.prev()
  element = fBefore  if fBefore.is('span.styled,span.OBS_checkbox')
  element

#define plugin
class Prompt
  
  #setup instance variables
  constructor: (elem, node, options) ->
    options = {color: options} if $.type(options) is 'string'
    @options = new Options if $.isPlainObject(options) then options else {}

    @elementType = elem.attr('type')
    @originalElement = elem
    @elem = getAnchorElement(elem)
    @elem.data pluginName, @

    #load user css into dom
    @loadCSS()
    #load user html into @container
    @loadHTML()

    @wrapper = $(styles.core.html)
    @container = @wrapper.find ".#{className}Container"

    @container.append @userContainer

    # add into dom
    @elem.before @wrapper
    @container.css @calculateCSS()

    @run(node)

  loadCSS: (style) ->
    name = @options.style
    style = @getStyle(name)
    elem = style.cssElem
    if elem
      elem.html style.css
    else
      elem = create("style").attr('id', "#{name}-styles").html style.css
      $("head").append elem
      style.cssElem = elem

  loadHTML: (style) ->
    style = @getStyle(name)
    @userContainer = $(style.html)
    @text = @userContainer.find '[data-notify=text]'
    if @text.length is 0
      throw "style: #{name} HTML is missing the: data-notify='text' attribute"
    @text.addClass "#{className}Text"

  buildArrow: ->
    dir = @options.arrowPosition
    size = @options.arrowSize
    alt = arrowDirs[dir]
    @arrow = create("div")
    @arrow.addClass(className + 'Arrow').css(
      'margin-top': 2 + (if document.documentMode is 5 then (size*-4) else 0)
      'position': 'relative'
      'z-index': '2'
      'margin-left': 10
      'width': 0
      'height': 0
    ).css(
      'border-' + alt, size + 'px solid ' + @getColor()
    )
    for d of arrowDirs
      @arrow.css 'border-' + d, size + 'px solid transparent'  if d isnt dir and d isnt alt

    showArrow = @options.arrowShow and @elementType isnt 'radio'
    if showArrow then @arrow.show() else @arrow.hide()

  showMain: (show) ->
    hidden = @container.parent().parents(':hidden').length > 0
    @container.show()  if hidden and show
    @container.hide()  if hidden and not show
    @container[@options.showAnimation] @options.showDuration  if not hidden and show
    @container[@options.hideAnimation] @options.hideDuration  if not hidden and not show

  calculateCSS: () ->
    elementPosition = @elem.position()
    mainPosition = @container.parent().position()
    height = @elem.outerHeight()
    left = elementPosition.left - mainPosition.left
    height += (elementPosition.top - mainPosition.top)  unless navigator.userAgent.match /MSIE/
    return {
      top: height + @options.gap
      left: left
    }

  getColor: ->
    @options.colors[@options.color] or @options.color

  getStyle: (name) ->
    name = @options.style unless name
    style = styles.user[name]
    throw "Missing style: #{name}" unless style
    style

  #run plugin
  run: (node, options) ->
    #update options
    if $.isPlainObject(options)
      $.extend @options, options 
    #shortcut special case
    else if $.type(options) is 'string'
      @options.color = options

    if @container and not node
      @showMain false #hide
      return
    else if not @container and not node
      return

    #update content
    if $.type(node) is 'string'
      @text.html node.replace('\n', '<br/>')
    else
      @text.empty().append(node)


    color = @getColor()
    @container.find('[data-notify-style]').each ->
      s = $(@).attr 'data-notify-style'
      $(@).attr 'style', s.replace /\{\{\s*COLOR\s*\}\}/ig, color

    @arrow.remove() if @arrow
    @buildArrow()
    @container.prepend @arrow

    @showMain true

    #autohide
    if @options.autoHidePrompt
      clearTimeout @elem.data 'mainTimer'
      t = setTimeout ->
        @showMain false
      , @options.autoHideDelay
      @elem.data 'mainTimer', t

#when ready, bind permanent hide listener
$ ->
  #add core styles
  $("head").append(create("style").html(styles.core.css))

  $(document).on 'click', ".#{className}", ->
    inst = getAnchorElement($(@)).data pluginName
    inst.showMain false if inst?

# publicise jquery plugin
# return alert "$.#{pluginName} already defined" if $[pluginName]?
# $.pluginName( { ...  } ) changes options for all instances
$[pluginName] = (elem, node, options) ->
  $(elem)[pluginName](node, options)

# publicise options method
$[pluginName].options = (options) ->
  $.extend pluginOptions, options

$[pluginName].addStyle = (s) ->
  $.extend true, styles.user, s

# $( ... ).pluginName( { .. } ) creates a cached instance on each
# selected item with custom options for just that instance
# return alert "$.fn#{pluginName} already defined" if $.fn[pluginName]?
$.fn[pluginName] = (node, options) ->
  $(@).each ->
    inst = getAnchorElement($(@)).data pluginName
    if inst?
      inst.run node, options
    else
      new Prompt $(@), node, options

#ps. alex is gay.

