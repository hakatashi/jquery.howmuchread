(function ($) {
  module('jQuery#howmuchread', {
    setup: function () {
      this.$element = $('#howmuchread');
    }
  });

  test('is countable', function () {
    // default
    strictEqual(this.$element.howmuchread(), 0, 'should be zero when on top');

    // scrolled

    this.$element.scrollTop(10);
    strictEqual(this.$element.howmuchread(), 50, 'should be on line 1');

    this.$element.scrollTop(20);
    strictEqual(this.$element.howmuchread(), 50, 'should be on line 1');

    this.$element.scrollTop(30);
    strictEqual(this.$element.howmuchread(), 50, 'should be on line 1');

    this.$element.scrollTop(45);
    strictEqual(this.$element.howmuchread(), 100, 'should be on line 2');

    this.$element.scrollTop(60);
    strictEqual(this.$element.howmuchread(), 100, 'should be on line 2');

    this.$element.scrollTop(90);
    strictEqual(this.$element.howmuchread(), 150, 'should be on line 3');

    this.$element.scrollTop(150);
    strictEqual(this.$element.howmuchread(), 250, 'should be on line 5');

    this.$element.scrollTop(250);
    strictEqual(this.$element.howmuchread(), 450, 'should be on line 9');

    this.$element.scrollTop(400);
    strictEqual(this.$element.howmuchread(), 500, 'should be on line 10');
  });
}(jQuery));
