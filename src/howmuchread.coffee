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

  # Get sanitized offset of parent element
  $parent = $ settings.parent
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
  offset.right = $(document).width() - offset.left - $parent.width()
  offset.bottom = $(document).height() - offset.top - $parent.height()

  # Physical offset to Logical offset
  if writingMode.horizontal
    if writingMode.ttb
      offset.before = offset.top
      offset.after = offset.bottom
    else
      offset.before = offset.bottom
      offset.after = offset.top

    if writingMode.rtl
      offset.start = offset.right
      offset.end = offset.left
    else
      offset.start = offset.left
      offset.end = offset.right

  else if writingMode.vertical
    if writingMode.rtl
      offset.before = offset.right
      offset.after = offset.left
    else
      offset.before = offset.left
      offset.after = offset.right

    if writingMode.ttb
      offset.start = offset.top
      offset.end = offset.bottom
    else
      offset.start = offset.bottom
      offset.end = offset.top

  # Convert settings.borderline to numeral borderline value
  if settings.borderline is 'before'
    borderline = offset.before
  else if settings.borderline is 'after'
    borderline = offset.after
  else if settings.borderline is 'center'
    borderline = (offset.before + offset.after) / 2
  else if typeof settings.borderline is 'number'
    borderline = offset.before * (1 - settings.borderline) + offset.after * settins.borderline
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
      if writingMode.ttb
        return targetOffset.top > borderline
      else
        return targetOffset.bottom < borderline
    else
      if writingMode.rtl
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
