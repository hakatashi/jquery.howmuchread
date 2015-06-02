/*
 *
 *
 *
 * Copyright (c) 2015 Koki Takahashi
 * Licensed under the MIT license.
 */
(function ($) {
  // wrap Nth character of text with span#howmuchread-wrapper
  function wrapNthCharacter(textNodes, N) {
    var cnt = 0;
    var target, position;

    // calculate target and position
    for (var i = 0; i < textNodes.length; i++) {
      cnt += textNodes[i].nodeValue.length;
      if (cnt > N) {
        target = textNodes[i];
        position = N - cnt + textNodes[i].nodeValue.length;
        break;
      }
    }

    if (!target) return false;

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
    $element.find('span#howmuchread-wrapper').contents().unwrap();
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

    // Get total length of text
    var totalLength = 0;
    $.each(textNodes, function (index, textNode) {
      totalLength += textNode.nodeValue.length;
    });

    // binary search
    var howmuchread = binarySearch(totalLength, function (N) {
      var i = 0;
      do {
        i++;
        var result = wrapNthCharacter(textNodes, N);
        if ($('span#howmuchread-wrapper').length === 0) continue;
        var testOffset = $('span#howmuchread-wrapper').offset();
        unwrapCharacter($this);
      } while (typeof testOffset === 'undefined' && i < 5);

      if (typeof testOffset === 'undefined') return false;

      if (testOffset.top > offset.top) {
        return true;
      } else {
        return false;
      }
    });

    return howmuchread;
  };

  $.fn.readafter = function (N) {
    var $this = $(this);
    var textNodes = getTextNodes($this);
    var offset = $this.offset();

    wrapNthCharacter(textNodes, N);
    var testOffset = $('span#howmuchread-wrapper').offset();
    unwrapCharacter($this);

    return $this.scrollTop($this.scrollTop() + testOffset.top - offset.top);
  };
}(jQuery));
