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
  borderline = getBorderValue parentOffset, settings.borderline

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
    baseline = getBorderValue targetOffset, settings.baseline

    return baseline > borderline

  if settings.getMetric
    metric = metrics[position]
    metric.position = position
    return metric
  else
    return position

howmuchread.scrollTo = (N, options) ->
  defaults =
    parent: this
    baseline: 'before'
    borderline: 'before'
    wrapperId: 'howmuchread-wrapper'
    writingMode: {}

  # Extend defaults to options
  settings = $.extend {}, defaults, options

  $parent = $ settings.parent

  # Parse writing-mode of parent element
  writingMode = $.extend parseWritingMode.call(this), settings.writingMode

  # Get offset of parent element
  parentOffset = getOffset settings.parent, writingMode

  # Convert settings.borderline to numeral borderline value
  # borderline value lies in same metrics with offset.before
  borderline = getBorderValue parentOffset, settings.borderline

  # Wrap target character and get offset
  wrapNthCharacter $(this), N, settings.wrapperId
  targetOffset = getOffset $("span##{settings.wrapperId}"), writingMode
  unwrapCharacter $(this), settings.wrapperId

  # Convert settings.baseline to numeral baseline value
  baseline = getBorderValue targetOffset, settings.baseline

  if writingMode.horizontal
    if writingMode.ttb
      $parent.scrollTop $parent.scrollTop() + (baseline - borderline)
    else
      $parent.scrollTop $parent.scrollTop() - (baseline - borderline)
  else
    if writingMode.rtl
      scrollLeft.call settings.parent, scrollLeft.call(settings.parent, undefined, writingMode) - (baseline - borderline), writingMode
    else
      scrollLeft.call settings.parent, scrollLeft.call(settings.parent, undefined, writingMode) + (baseline - borderline), writingMode

howmuchread.getLength = ->
  textNodes = getTextNodes $ this
  totalLength = 0
  $.each textNodes, (index, textNode) ->
    totalLength += textNode.nodeValue.length
  return totalLength
