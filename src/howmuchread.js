/*
 * 
 * 
 *
 * Copyright (c) 2015 Koki Takahashi
 * Licensed under the MIT license.
 */
(function ($) {
  $.fn.howmuchread = function () {
    return this.each(function (i) {
      // Do something to each selected element.
      $(this).html('howmuchread' + i);
    });
  };
}(jQuery));
