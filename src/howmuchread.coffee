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
    writingMode: {}
    getMetric: false

  # Extend defaults to options
  settings = $.extend {}, defaults, options

  # Parse writing-mode of parent element
  writingMode = $.extend parseWritingMode.call(this), settings.writingMode

  # Get offset of parent element
  parentOffset = getOffset settings.parent, writingMode

  # Convert settings.borderline to numeral borderline value
  # borderline value lies in same metrics with offset.before
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

  # Metrics cache
  metrics = {}

  # binary search
  position = binarySearch totalLength, (N) =>
    wrapNthCharacter $(this), N, settings.wrapperId
    targetOffset = getOffset $("span##{settings.wrapperId}"), writingMode
    unwrapCharacter $(this), settings.wrapperId

    # Cache metrics
    metrics[N] = targetOffset

    # Convert settings.baseline to numeral baseline value
    if settings.baseline is 'before'
      baseline = targetOffset.before
    else if settings.baseline is 'after'
      baseline = targetOffset.before + targetOffset.blockSize
    else if settings.baseline is 'center'
      baseline = targetOffset.before + targetOffset.blockSize / 2
    else if typeof settings.baseline is 'number'
      baseline = targetOffset.before + targetOffset.blockSize * settings.baseline
    else
      throw new TypeError 'howmuchread: options.baseline must be string or number'

    return baseline > borderline

  if settings.getMetric
    metric = metrics[position]
    metric.position = position
    return metrics
  else
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
