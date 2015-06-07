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

  # Extend defaults to options
  settings = $.extend {}, defaults, options

  # Parse writing-mode of parent element
  writingMode = parseWritingMode.call this

  # Get offset of parent element
  parentOffset = getOffset settings.parent, writingMode

  # Convert settings.borderline to numeral borderline value
  if settings.borderline is 'before'
    borderline = parentOffset.before
  else if settings.borderline is 'after'
    borderline = parentOffset.before + parentOffset.blockSize
  else if settings.borderline is 'center'
    borderline = parentOffset.before + parentOffset.blockSize / 2
  else if typeof settings.borderline is 'number'
    borderline = parentOffset.before + parentOffset.blockSize * settings.borderline
  else
    throw new TypeError 'howmuchread: options.borderline must be string or number'

  # Get total length of text
  totalLength = howmuchread.getLength.call this

  # binary search
  position = binarySearch totalLength, (N) =>
    wrapNthCharacter $(this), N, settings.wrapperId
    targetOffset = $("span##{settings.wrapperId}").offset()
    targetOffset.right = $(document).width() - (targetOffset.left) - $("span##{settings.wrapperId}").width()
    targetOffset.bottom = $(document).height() - (targetOffset.top) - $("span##{settings.wrapperId}").height()
    unwrapCharacter $(this), settings.wrapperId

    if writingMode.horizontal
      if writingMode.asc
        return targetOffset.top > borderline
      else
        return targetOffset.bottom < borderline
    else
      if writingMode.asc
        return targetOffset.right > borderline
      else
        return targetOffset.left < borderline

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
  else if $parent.is $ document
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
  return totalLength