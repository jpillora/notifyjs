
App = App or {}

mod = (v,m) -> (if v<0 then m else 0) + v%m

App.posChooser = ->

  if /MSIE (\d)/.test(window.navigator.userAgent) and 
     parseInt(RegExp.$1,10) < 8
    return

  positions = []
  
  mPos = ['top','right','bottom','left']
  vPos = ['top','middle','bottom']
  hPos = ['left','center','right']

  for p1 in mPos
    p2s = if p1 in vPos then hPos else vPos
    p2s.reverse() if p1 in ['bottom','left'] 
    for p2 in p2s
      positions.push "#{p1} #{p2}"

  currPos = 'top left'
  currType = 'elem'
  open = ->
    opts = 
      position: currPos
    if currType is 'elem'
      $(".pos-chooser-demo").notify "#{currPos}", opts
    else
      $.notify "#{currPos}", opts

  $(".pos-chooser").knob
    stopper: false
    change: (val) ->
      val = mod val,positions.length
      currPos = positions[val]
      open()

  $(".pos-chooser").siblings().first().addClass(".pos-chooser-dial")

  $(document).on 'click', 'input[name=pos-type]', ->
    currType = $(@).val()
    open()
