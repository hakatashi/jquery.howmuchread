/*
 *
 *
 *
 * Copyright (c) 2015 Koki Takahashi
 * Licensed under the MIT license.
 */
(function ($) {
  $.fn.howmuchread = function () {
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

    // wrap Nth character of text with span#howmuchread-wrapper
    function wrapNthCharacter(N) {
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

    function unwrapCharacter() {
      $(this).find('span#howmuchread').contents().unwrap();
    }

    var textNodes = getTextNodes($(this));

    // Get total length of text
    var totalLength = 0;
    $.each(textNodes, function (index, textNode) {
      totalLength += textNode.nodeValue.length;
    });

    // binary search

    return getTextNodes($(this));
  };
}(jQuery));
