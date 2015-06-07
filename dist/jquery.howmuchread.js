(function() {
  var $, binarySearch, getBorderValue, getOffset, getTextNodes, howmuchread, parseWritingMode, rtlScrollType, scrollLeft, unwrapCharacter, wrapNthCharacter;

  $ = jQuery;

  rtlScrollType = {
    'vertical': 'reverse',
    'horizontal': 'reverse'
  };

  $.fn.howmuchread = function(action) {
    if (howmuchread[action]) {
      return howmuchread[action].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
      return howmuchread.get.apply(this, arguments);
    }
  };

  howmuchread = {};

  howmuchread.get = function(options) {
    var borderline, defaults, metric, metrics, parentOffset, position, settings, totalLength, writingMode;
    defaults = {
      parent: this,
      baseline: 'before',
      borderline: 'before',
      wrapperId: 'howmuchread-wrapper',
      writingMode: {},
      getMetric: false
    };
    settings = $.extend({}, defaults, options);
    writingMode = $.extend(parseWritingMode.call(this), settings.writingMode);
    parentOffset = getOffset(settings.parent, writingMode);
    borderline = getBorderValue(parentOffset, settings.borderline);
    totalLength = howmuchread.getLength.call(this);
    metrics = {};
    position = binarySearch(totalLength, (function(_this) {
      return function(N) {
        var baseline, targetOffset;
        wrapNthCharacter($(_this), N, settings.wrapperId);
        targetOffset = getOffset($("span#" + settings.wrapperId), writingMode);
        unwrapCharacter($(_this), settings.wrapperId);
        metrics[N] = targetOffset;
        baseline = getBorderValue(targetOffset, settings.baseline);
        return baseline > borderline;
      };
    })(this));
    if (settings.getMetric) {
      metric = metrics[position];
      metric.position = position;
      return metric;
    } else {
      return position;
    }
  };

  howmuchread.scrollTo = function(N, options) {
    var $parent, baseline, borderline, defaults, parentOffset, settings, targetOffset, writingMode;
    defaults = {
      parent: this,
      baseline: 'before',
      borderline: 'before',
      wrapperId: 'howmuchread-wrapper',
      writingMode: {}
    };
    settings = $.extend({}, defaults, options);
    $parent = $(settings.parent);
    writingMode = $.extend(parseWritingMode.call(this), settings.writingMode);
    parentOffset = getOffset(settings.parent, writingMode);
    borderline = getBorderValue(parentOffset, settings.borderline);
    wrapNthCharacter($(this), N, settings.wrapperId);
    targetOffset = getOffset($("span#" + settings.wrapperId), writingMode);
    unwrapCharacter($(this), settings.wrapperId);
    baseline = getBorderValue(targetOffset, settings.baseline);
    if (writingMode.horizontal) {
      if (writingMode.ttb) {
        return $parent.scrollTop($parent.scrollTop() + (baseline - borderline));
      } else {
        return $parent.scrollTop($parent.scrollTop() - (baseline - borderline));
      }
    } else {
      if (writingMode.rtl) {
        return scrollLeft.call(settings.parent, scrollLeft.call(settings.parent, void 0, writingMode) - (baseline - borderline), writingMode);
      } else {
        return scrollLeft.call(settings.parent, scrollLeft.call(settings.parent, void 0, writingMode) + (baseline - borderline), writingMode);
      }
    }
  };

  howmuchread.getLength = function() {
    var textNodes, totalLength;
    textNodes = getTextNodes($(this));
    totalLength = 0;
    $.each(textNodes, function(index, textNode) {
      return totalLength += textNode.nodeValue.length;
    });
    return totalLength;
  };

  wrapNthCharacter = function($element, N, wrapperId) {
    var cnt, i, position, target, text, textNodes;
    cnt = 0;
    textNodes = getTextNodes($element);
    i = 0;
    while (i < textNodes.length) {
      cnt += textNodes[i].nodeValue.length;
      if (cnt > N) {
        target = textNodes[i];
        position = N - cnt + textNodes[i].nodeValue.length;
        break;
      }
      i++;
    }
    if (!target) {
      return false;
    }
    text = target.nodeValue;
    $(target).replaceWith([
      document.createTextNode(text.slice(0, position)), $('<span/>', {
        'id': wrapperId,
        'text': text.substr(position, 1)
      }), document.createTextNode(text.slice(position + 1))
    ]);
    return true;
  };

  unwrapCharacter = function($element, wrapperId) {
    $element.find("span#" + wrapperId).each(function() {
      var next, prev, text;
      prev = this.previousSibling;
      next = this.nextSibling;
      text = '';
      if (prev && prev.nodeType === 3) {
        text += prev.nodeValue;
        $(prev).remove();
      }
      text += $(this).text();
      if (next && next.nodeType === 3) {
        text += next.nodeValue;
        $(next).remove();
      }
      $(this).replaceWith(document.createTextNode(text));
    });
  };

  getTextNodes = function($element) {
    var ret;
    ret = [];
    $element.contents().each(function() {
      if (this.nodeType === 1) {
        ret = ret.concat(getTextNodes($(this)));
      } else if (this.nodeType === 3) {
        ret.push(this);
      }
    });
    return ret;
  };

  parseWritingMode = function() {
    var $this, horizontal, rtl, ttb, vertical, writingMode;
    if ($(this).is($(window)) || $(this).is($(document))) {
      $this = $('body');
    } else {
      $this = $(this);
    }
    writingMode = $this.css('writing-mode') || $this.css('-webkit-writing-mode') || $this.css('-ms-writing-mode') || $this.css('-moz-writing-mode') || $this.get(0).style.writingMode || $this.get(0).style.msWritingMode;
    if (writingMode === void 0 || writingMode === 'horizontal-tb' || writingMode === 'lr-tb' || writingMode === 'rl-tb') {
      vertical = false;
      horizontal = true;
      ttb = true;
      rtl = $this.css('direction') === 'rtl' || writingMode === 'rl-tb';
    } else {
      vertical = true;
      horizontal = false;
      ttb = $this.css('text-orientation') === 'sideways-left' ? $this.css('direction') === 'rtl' : $this.css('direction') !== 'rtl';
      rtl = writingMode === void 0 || writingMode === 'vertical-rl' || writingMode === 'tb' || writingMode === 'tb-rl';
    }
    return {
      vertical: vertical,
      horizontal: horizontal,
      ttb: ttb,
      rtl: rtl
    };
  };

  getBorderValue = function(offset, position) {
    if (position === 'before') {
      return offset.before;
    } else if (position === 'after') {
      return offset.before + offset.blockSize;
    } else if (position === 'center') {
      return offset.before + offset.blockSize / 2;
    } else if (typeof position === 'number') {
      return offset.before + offset.blockSize * position;
    } else {
      throw new TypeError('howmuchread: position must be string or number');
    }
  };

  scrollLeft = function(value, writingMode) {
    var scrollType;
    writingMode = writingMode || parseWritingMode.call(this);
    scrollType = void 0;
    if (writingMode.rtl) {
      if (writingMode.vertical) {
        scrollType = rtlScrollType.vertical;
      } else {
        scrollType = rtlScrollType.horizontal;
      }
    } else {
      scrollType = 'default';
    }
    if (typeof value === 'undefined') {
      if (scrollType === 'default') {
        return $(this).scrollLeft();
      } else if (scrollType === 'negative') {
        return $(this).scrollLeft() + $(this).width();
      } else if (scrollType === 'reverse') {
        return $(this).width() - $(this).scrollLeft();
      } else {
        return $(this).scrollLeft();
      }
    } else {
      if (scrollType === 'default') {
        return $(this).scrollLeft(value);
      } else if (scrollType === 'negative') {
        return $(this).scrollLeft(value - $(this).width());
      } else if (scrollType === 'reverse') {
        return $(this).scrollLeft($(this).width() - value);
      } else {
        return $(this).scrollLeft(value);
      }
    }
  };

  getOffset = function(element, writingMode) {
    var $element, offset;
    writingMode = writingMode || parseWritingMode.call(element);
    $element = $(element);
    if ($element.is($(window))) {
      offset = {
        top: $(window).scrollTop(),
        left: $(window).scrollLeft()
      };
    } else if ($element.is($(document))) {
      offset = {
        top: 0,
        left: 0
      };
    } else {
      offset = $element.offset();
    }
    offset.width = $element.width();
    offset.height = $element.height();
    offset.right = $(document).width() - offset.left - offset.width;
    offset.bottom = $(document).height() - offset.top - offset.height;
    if (writingMode.horizontal) {
      offset.blockSize = offset.height;
      offset.inlineSize = offset.width;
      if (writingMode.ttb) {
        offset.before = offset.top;
        offset.after = offset.bottom;
      } else {
        offset.before = offset.bottom;
        offset.after = offset.top;
      }
      if (writingMode.rtl) {
        offset.start = offset.right;
        offset.end = offset.left;
      } else {
        offset.start = offset.left;
        offset.end = offset.right;
      }
    } else if (writingMode.vertical) {
      offset.blockSize = offset.width;
      offset.inlineSize = offset.height;
      if (writingMode.rtl) {
        offset.before = offset.right;
        offset.after = offset.left;
      } else {
        offset.before = offset.left;
        offset.after = offset.right;
      }
      if (writingMode.ttb) {
        offset.start = offset.top;
        offset.end = offset.bottom;
      } else {
        offset.start = offset.bottom;
        offset.end = offset.top;
      }
    }
    return offset;
  };

  $(document).ready(function() {

    /*! jQuery RTL Scroll Type Detector | Copyright (c) 2012 Wei-Ko Kao | MIT License */
    var $definer, definer;
    definer = void 0;
    definer = $('<div/>', {
      dir: 'rtl',
      text: 'A',
      css: {
        fontSize: '14px',
        width: '1px',
        height: '1px',
        position: 'absolute',
        top: '-1000px',
        overflow: 'scroll'
      }
    }).appendTo('body')[0];
    rtlScrollType.horizontal = 'reverse';
    if (definer.scrollLeft > 0) {
      rtlScrollType.horizontal = 'default';
    } else {
      definer.scrollLeft = 1;
      if (definer.scrollLeft === 0) {
        rtlScrollType.horizontal = 'negative';
      }
    }
    $(definer).remove();
    $definer = $('<div/>', {
      text: 'A',
      css: {
        fontSize: '14px',
        width: '1px',
        height: '1px',
        position: 'absolute',
        top: '-1000px',
        overflow: 'scroll',
        writingMode: 'tb-rl',
        OWritingMode: 'vertical-rl',
        MsWritingMode: 'tb-rl',
        MozWritingMode: 'vertical-rl',
        WebkitWritingMode: 'vertical-rl'
      }
    });
    definer = $definer.css({
      writingMode: 'vertical-rl',
      MsWritingMode: 'vertical-rl'
    }).appendTo('body')[0];
    rtlScrollType.vertical = 'reverse';
    if (definer.scrollLeft > 0) {
      rtlScrollType.vertical = 'default';
    } else {
      definer.scrollLeft = 1;
      if (definer.scrollLeft === 0) {
        rtlScrollType.vertical = 'negative';
      }
    }
    $(definer).remove();
  });

  binarySearch = function(size, test) {
    var max, mid, min, result;
    min = 0;
    max = size;
    while (min !== max) {
      mid = Math.floor((min + max) / 2);
      result = test(mid);
      if (result) {
        max = mid;
      } else {
        min = mid + 1;
      }
    }
    return min;
  };

}).call(this);
