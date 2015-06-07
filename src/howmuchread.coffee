$.fn.howmuchread = (action) ->
  if howmuchread[action]
    return howmuchread[action].apply this, Array.prototype.slice.call arguments, 1
  else
    return howmuchread.get.apply this, arguments

howmuchread = {}

howmuchread.get = (options) ->
  defaults =
    parent: this
    baseline: 'before'
    borderline: 'before'
    wrapperId: 'howmuchread-wrapper'

  settings = $.extend defaults, options
  $this = $ this
  $parent = $ settings.parent
  textNodes = getTextNodes $this
  if $parent.is $ window
    offset =
      top: $(window).scrollTop()
      left: $(window).scrollLeft()
  else if $parent.is $ document
    offset =
      top: 0
      left: 0
  else
    offset = $parent.offset()
  offset.right = $(document).width() - (offset.left) - $parent.width()
  offset.bottom = $(document).height() - (offset.top) - $parent.height()
  writingMode = parseWritingMode.call(this)

  # Get total length of text
  totalLength = 0
  $.each textNodes, (index, textNode) ->
    totalLength += textNode.nodeValue.length
    return

  # binary search
  position = binarySearch totalLength, (N) ->
    i = 0
    loop
      i++
      wrapNthCharacter $this, N, settings.wrapperId
      targetOffset = $("span##{settings.wrapperId}").offset()
      targetOffset.right = $(document).width() - (targetOffset.left) - $("span##{settings.wrapperId}").width()
      targetOffset.bottom = $(document).height() - (targetOffset.top) - $("span##{settings.wrapperId}").height()
      unwrapCharacter $this, settings.wrapperId
      unless typeof targetOffset == 'undefined' and i < 5
        break

    if writingMode.horizontal
      if writingMode.ttb
        if targetOffset.top > offset.top
          true
        else
          false
      else
        if targetOffset.bottom < offset.bottom
          true
        else
          false
    else
      if writingMode.rtl
        if targetOffset.right > offset.right
          true
        else
          false
      else
        if targetOffset.left < offset.left
          true
        else
          false

  return position

howmuchread.scrollTo = (N, options) ->
  options = $.extend parent: this, options
  $this = $ this
  $parent = $ options.parent
  console.log this
  writingMode = parseWritingMode.call this
  if $parent.is $ window
    offset =
      top: $(window).scrollTop()
      left: $(window).scrollLeft()
  else if $parent.is $ documen
    offset =
      top: 0
      left: 0
  else
    offset = $parent.offset()
  wrapNthCharacter $this, N
  testOffset = $('span#howmuchread-wrapper').offset()
  testHeight = $('span#howmuchread-wrapper').height()
  testWidth = $('span#howmuchread-wrapper').width()
  unwrapCharacter $this
  if writingMode.horizontal
    if writingMode.ttb
      $parent.scrollTop $parent.scrollTop() + testOffset.top - (offset.top)
    else
      $parent.scrollTop $parent.scrollTop() + testOffset.top - (offset.top) - $parent.height() + testHeight
  else
    if writingMode.rtl
      scrollLeft.call options.parent, scrollLeft.call(options.parent, undefined, writingMode) + testOffset.left - (offset.left) - $parent.width() + testWidth, parseWritingMode.call(this), writingMode
    else
      scrollLeft.call options.parent, scrollLeft.call(options.parent, undefined, writingMode) + testOffset.left - (offset.left), parseWritingMode.call(this), writingMode

howmuchread.getLength = ->
  textNodes = getTextNodes $ this
  totalLength = 0
  $.each textNodes, (index, textNode) ->
    totalLength += textNode.nodeValue.length
    return
  totalLength
