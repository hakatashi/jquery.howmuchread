(function ($) {
  module('jQuery.howmuchread on RTL', {
    setup: function () {
      this.$vertical = $('#howmuchread-vertical-rl');

      /*! jQuery RTL Scroll Type Detector | Copyright (c) 2012 Wei-Ko Kao | MIT License */
      var definer = $('<div style="font-size: 14px; width: 1px; height: 1px; position: absolute; top: -1000px; overflow: scroll; writing-mode: tb-rl; writing-mode: vertical-rl; -o-writing-mode: vertical-rl; -ms-writing-mode: tb-rl; -ms-writing-mode: vertical-rl; -moz-writing-mode: vertical-rl; -webkit-writing-mode: vertical-rl;">A</div>').appendTo('body')[0],
          type = 'reverse';

      if (definer.scrollLeft > 0) {
          type = 'default';
      } else {
          definer.scrollLeft = 1;
          if (definer.scrollLeft === 0) {
              type = 'negative';
          }
      }

      $(definer).remove();
      this.rtlScrollType = type;
    }
  });

  test('is propery countable on vertical-rl', function () {
    function scrollTo(scrollRight) {
      var width = this.$vertical.width();
      var scrollWidth = this.$vertical.get(0).scrollWidth;

      if (this.rtlScrollType === 'default') {
        this.$vertical.scrollLeft(scrollWidth - width - scrollRight);
      } else if (this.rtlScrollType === 'negative') {
        this.$vertical.scrollLeft(- scrollRight);
      } else if (this.rtlScrollType === 'reverse') {
        this.$vertical.scrollLeft(scrollRight);
      }
    }

    // default

    strictEqual(this.$vertical.howmuchread(), 0, 'should be zero when on right');

    // scrolled

    scrollTo.call(this, 10);
    strictEqual(this.$vertical.howmuchread(), 15, 'should be on line 1');

    scrollTo.call(this, 20);
    strictEqual(this.$vertical.howmuchread(), 15, 'should be on line 1');

    scrollTo.call(this, 30);
    strictEqual(this.$vertical.howmuchread(), 15, 'should be on line 1');

    scrollTo.call(this, 45);
    strictEqual(this.$vertical.howmuchread(), 30, 'should be on line 2');

    scrollTo.call(this, 60);
    strictEqual(this.$vertical.howmuchread(), 30, 'should be on line 2');

    scrollTo.call(this, 90);
    strictEqual(this.$vertical.howmuchread(), 45, 'should be on line 3');

    scrollTo.call(this, 150);
    strictEqual(this.$vertical.howmuchread(), 75, 'should be on line 5');

    scrollTo.call(this, 250);
    strictEqual(this.$vertical.howmuchread(), 135, 'should be on line 9');

    scrollTo.call(this, 460);
    strictEqual(this.$vertical.howmuchread(), 240, 'should be on line 16');

    // scrolled over

    scrollTo.call(this, 600);
    strictEqual(this.$vertical.howmuchread(), 278, 'should be read over');
  });
}(jQuery));
