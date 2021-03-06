# wrap Nth character of text with span#howmuchread-wrapper
wrapNthCharacter = ($element, N, wrapperId) ->
  cnt = 0
  textNodes = getTextNodes($element)
  # calculate target and position
  i = 0
  while i < textNodes.length
    cnt += textNodes[i].nodeValue.length
    if cnt > N
      target = textNodes[i]
      position = N - cnt + textNodes[i].nodeValue.length
      break
    i++
  if !target
    return false
  text = target.nodeValue
  $(target).replaceWith [
    document.createTextNode text.slice 0, position
    $ '<span/>',
      'id': wrapperId
      'text': text.substr position, 1
    document.createTextNode text.slice position + 1
  ]
  true

unwrapCharacter = ($element, wrapperId) ->
  $element.find("span##{wrapperId}").each ->
    prev = @previousSibling
    next = @nextSibling
    text = ''
    if prev and prev.nodeType == 3
      text += prev.nodeValue
      $(prev).remove()
    text += $(this).text()
    if next and next.nodeType == 3
      text += next.nodeValue
      $(next).remove()
    $(this).replaceWith document.createTextNode(text)
    return
  return

# get descending text nodes array in the order they appears
getTextNodes = ($element) ->
  ret = []
  $element.contents().each ->
    # ELEMENT_NODE
    if @nodeType is 1
      ret = ret.concat getTextNodes $ this
    else if @nodeType is 3
      ret.push this
    return
  ret

parseWritingMode = ->
  if $(this).is($(window)) or $(this).is($(document))
    $this = $ 'body'
  else
    $this = $(this)

  writingMode =
    $this.css('writing-mode') or
    $this.css('-webkit-writing-mode') or
    $this.css('-ms-writing-mode') or
    $this.css('-moz-writing-mode') or
    $this.get(0).style.writingMode or
    $this.get(0).style.msWritingMode

  if writingMode is undefined or writingMode is 'horizontal-tb' or writingMode is 'lr-tb' or writingMode is 'rl-tb'
    vertical = false
    horizontal = true
    ttb = true
    rtl = $this.css('direction') == 'rtl' or writingMode == 'rl-tb'
  else
    vertical = true
    horizontal = false
    ttb = if $this.css('text-orientation') == 'sideways-left' then $this.css('direction') == 'rtl' else $this.css('direction') != 'rtl'
    rtl = writingMode == undefined or writingMode == 'vertical-rl' or writingMode == 'tb' or writingMode == 'tb-rl'

  return {
    vertical: vertical
    horizontal: horizontal
    ttb: ttb
    rtl: rtl
  }

# Convert position value to numeral value
# returned value lies in same metrics with offset.before
getBorderValue = (offset, position) ->
  switch typeof position
    when 'string'
      switch position
        when 'before'
          offset.before
        when 'after'
          offset.before + offset.blockSize
        when 'center'
          offset.before + offset.blockSize / 2
        when 'scroll'
          if offset.scroll is null
            offset.before + offset.blockSize
          else
            offset.before + offset.blockSize * offset.scroll
        else
          throw new TypeError 'howmuchread: Unknown position type'

    when 'object'
      switch position.unit
        when '%'
          offset.before + offset.blockSize * position.value / 100
        when 'px'
          offset.before + position.value
        else
          throw new TypeError 'howmuchread: Unknown position.unit type'

    when 'number'
      console.error 'howmuchread: Specifying position by number is deprecated. Use {value: ..., unit: "%"} instead.'
      offset.before + offset.blockSize * position

    else
      throw new TypeError 'howmuchread: Position must be string or number'

# scrollLeft with support for RTL
scrollLeft = (value, writingMode) ->
  writingMode = writingMode or parseWritingMode.call(this)
  scrollType = undefined
  if writingMode.rtl
    if writingMode.vertical
      scrollType = rtlScrollType.vertical
    else
      scrollType = rtlScrollType.horizontal
  else
    scrollType = 'default'
  if typeof value == 'undefined'
    if scrollType == 'default'
      $(this).scrollLeft()
    else if scrollType == 'negative'
      $(this).scrollLeft() + $(this).width()
    else if scrollType == 'reverse'
      $(this).width() - $(this).scrollLeft()
    else
      $(this).scrollLeft()
  else
    if scrollType == 'default'
      $(this).scrollLeft value
    else if scrollType == 'negative'
      $(this).scrollLeft value - $(this).width()
    else if scrollType == 'reverse'
      $(this).scrollLeft $(this).width() - value
    else
      $(this).scrollLeft value

# Get offset position along with logical parameters
getOffset = (element, writingMode) ->
  writingMode = writingMode or parseWritingMode.call element

  $element = $ element

  if $element.is $ window
    offset =
      top: $(window).scrollTop()
      left: $(window).scrollLeft()
      scrollHeight: $(document).height()
      scrollWidth: $(document).width()
  else if $element.is $ document
    offset =
      top: 0
      left: 0
      scrollHeight: $(document).height()
      scrollWidth: $(document).width()
  else
    offset = $element.offset()
  offset.width = $element.width()
  offset.height = $element.height()
  offset.right = $(document).width() - offset.left - offset.width
  offset.bottom = $(document).height() - offset.top - offset.height

  offset.scrollTop = $element.scrollTop()
  offset.scrollLeft = scrollLeft undefined, writingMode
  offset.scrollHeight ?= $element.get(0).scrollHeight
  offset.scrollWidth ?= $element.get(0).scrollWidth

  # Physical offset to Logical offset
  if writingMode.horizontal
    offset.blockSize = offset.height
    offset.inlineSize = offset.width

    if writingMode.ttb
      offset.before = offset.top
      offset.after = offset.bottom
      offset.scroll = switch offset.scrollHeight - offset.height
        when 0 then null
        else offset.scrollTop / (offset.scrollHeight - offset.height)
    else
      offset.before = offset.bottom
      offset.after = offset.top
      offset.scroll = switch offset.scrollHeight - offset.height
        when 0 then null
        else 1 - offset.scrollTop / (offset.scrollHeight - offset.height)

    if writingMode.rtl
      offset.start = offset.right
      offset.end = offset.left
    else
      offset.start = offset.left
      offset.end = offset.right

  else if writingMode.vertical
    offset.blockSize = offset.width
    offset.inlineSize = offset.height

    if writingMode.rtl
      offset.before = offset.right
      offset.after = offset.left
      offset.scroll = switch offset.scrollWidth - offset.width
        when 0 then null
        else 1 - offset.scrollLeft / (offset.scrollWidth - offset.width)
    else
      offset.before = offset.left
      offset.after = offset.right
      offset.scroll = switch offset.scrollWidth - offset.width
        when 0 then null
        else offset.scrollLeft / (offset.scrollWidth - offset.width)

    if writingMode.ttb
      offset.start = offset.top
      offset.end = offset.bottom
    else
      offset.start = offset.bottom
      offset.end = offset.top

  return offset

# detect rtl scroll type mode
$(document).ready ->
  ###! jQuery RTL Scroll Type Detector | Copyright (c) 2012 Wei-Ko Kao | MIT License ###
  definer = undefined

  # on horizontal
  definer = $('<div/>',
    dir: 'rtl'
    text: 'A'
    css:
      fontSize: '14px'
      width: '1px'
      height: '1px'
      position: 'absolute'
      top: '-1000px'
      overflow: 'scroll'
  ).appendTo('body')[0]

  rtlScrollType.horizontal = 'reverse'
  if definer.scrollLeft > 0
    rtlScrollType.horizontal = 'default'
  else
    definer.scrollLeft = 1
    if definer.scrollLeft == 0
      rtlScrollType.horizontal = 'negative'

  $(definer).remove()

  # on vertical
  $definer = $ '<div/>',
    text: 'A'
    css:
      fontSize: '14px'
      width: '1px'
      height: '1px'
      position: 'absolute'
      top: '-1000px'
      overflow: 'scroll'
      writingMode: 'tb-rl'
      OWritingMode: 'vertical-rl'
      MsWritingMode: 'tb-rl'
      MozWritingMode: 'vertical-rl'
      WebkitWritingMode: 'vertical-rl'
  definer = $definer.css(
    writingMode: 'vertical-rl'
    MsWritingMode: 'vertical-rl'
  ).appendTo('body')[0]

  rtlScrollType.vertical = 'reverse'
  if definer.scrollLeft > 0
    rtlScrollType.vertical = 'default'
  else
    definer.scrollLeft = 1
    if definer.scrollLeft == 0
      rtlScrollType.vertical = 'negative'

  $(definer).remove()

  return

# binary search: determine the minimum integer that passes test.
binarySearch = (size, test) ->
  min = 0 # min passes
  max = size # max fails + 1

  while min != max
    mid = Math.floor (min + max) / 2
    result = test mid
    if result
      # if passes
      max = mid
    else
      # if fails
      min = mid + 1

  return min
