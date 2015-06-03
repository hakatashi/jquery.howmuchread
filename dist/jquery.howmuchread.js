/*! howmuchread - v0.0.1 - 2015-06-03
* https://github.com/hakatashi/howmuchread
* Copyright (c) 2015 ; Licensed MIT */
(function ($) {
  // wrap Nth character of text with span#howmuchread-wrapper
  function wrapNthCharacter($element, N) {
    var cnt = 0;
    var target, position;

    var textNodes = getTextNodes($element);

    // calculate target and position
    for (var i = 0; i < textNodes.length; i++) {
      cnt += textNodes[i].nodeValue.length;
      if (cnt > N) {
        target = textNodes[i];
        position = N - cnt + textNodes[i].nodeValue.length;
        break;
      }
    }

    if (!target) {
      return false;
    }

    var text = target.nodeValue;

    $(target).replaceWith([
      document.createTextNode(text.slice(0, position)),
      $('<span/>', {
        'id': 'howmuchread-wrapper',
        'text': text.substr(position, 1)
      }),
      document.createTextNode(text.slice(position + 1))
    ]);

    return true;
  }

  function unwrapCharacter($element) {
    $element.find('span#howmuchread-wrapper').each(function () {
      var prev = this.previousSibling;
      var next = this.nextSibling;

      var text = '';

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
  }

  // get descending text nodes array in the order they appears
  function getTextNodes($element) {
    var ret = [];

    $element.contents().each(function () {
      // ELEMENT_NODE
      if (this.nodeType === 1) {
        ret = ret.concat(getTextNodes($(this)));
      }
      // TEXT_NODE
      else if (this.nodeType === 3) {
        ret.push(this);
      }
    });

    return ret;
  }

  function parseWritingMode() {
    var writingMode = $(this).css('writing-mode') || $(this).css('-webkit-writing-mode') || $(this).css('-ms-writing-mode') || $(this).css('-moz-writing-mode') || $(this).get(0).style.writingMode || $(this).get(0).style.msWritingMode;
    var vertical, horizontal, ttb, rtl;

    if (writingMode === 'horizontal-tb' || writingMode === 'lr-tb' || writingMode === 'rl-tb') {
      vertical = false;
      horizontal = true;
      ttb = true;
      rtl = ($(this).css('direction') === 'rtl' || writingMode === 'rl-tb');
    } else {
      vertical = true;
      horizontal = false;
      ttb = ($(this).css('text-orientation') === 'sideways-left') ? ($(this).css('direction') === 'rtl') : ($(this).css('direction') !== 'rtl');
      rtl = (writingMode === undefined || writingMode === 'vertical-rl' || writingMode === 'tb' || writingMode === 'tb-rl');
    }

    return {
      'vertical': vertical,
      'horizontal': horizontal,
      'ttb': ttb,
      'rtl': rtl
    };
  }

  $.fn.howmuchread = function () {
    // binary search: determine the minimum number that passes test.
    function binarySearch(length, test) {
      var min = 0;      // max fails + 1
      var max = length; // min passes

      while (min !== max) {
        var mid = Math.floor((min + max) / 2);
        var result = test(mid);

        if (result) {
          // if passes
          max = mid;
        } else {
          // if fails
          min = mid + 1;
        }
      }

      return min;
    }

    var $this = $(this);
    var textNodes = getTextNodes($this);
    var offset = $this.offset();
    offset.right = $(document).width() - offset.left - $this.width();
    offset.bottom = $(document).height() - offset.top - $this.height();

    var writingMode = parseWritingMode.call(this);

    // Get total length of text
    var totalLength = 0;
    $.each(textNodes, function (index, textNode) {
      totalLength += textNode.nodeValue.length;
    });

    // binary search
    var howmuchread = binarySearch(totalLength, function (N) {
      var i = 0;
      var targetOffset;

      do {
        i++;
        wrapNthCharacter($this, N);
        targetOffset = $('span#howmuchread-wrapper').offset();
        targetOffset.right = $(document).width() - targetOffset.left - $('span#howmuchread-wrapper').width();
        targetOffset.bottom = $(document).height() - targetOffset.top - $('span#howmuchread-wrapper').height();
        unwrapCharacter($this);
      } while (typeof targetOffset === 'undefined' && i < 5);

      if (writingMode.horizontal) {
        if (writingMode.ttb) {
          if (targetOffset.top > offset.top) {
            return true;
          } else {
            return false;
          }
        } else {
          if (targetOffset.bottom < offset.bottom) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        if (writingMode.rtl) {
          if (targetOffset.right > offset.right) {
            return true;
          } else {
            return false;
          }
        } else {
          if (targetOffset.left < offset.left) {
            return true;
          } else {
            return false;
          }
        }
      }
    });

    return howmuchread;
  };

  $.fn.readafter = function (N) {
    var $this = $(this);
    var offset = $this.offset();

    wrapNthCharacter($this, N);
    var testOffset = $('span#howmuchread-wrapper').offset();
    unwrapCharacter($this);

    return $this.scrollTop($this.scrollTop() + testOffset.top - offset.top);
  };
}(jQuery));
