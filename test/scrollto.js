(function ($) {
  module('jQuery.howmuchread(\'scrollTo\')', {
    setup: function () {
      this.$element = $('#howmuchread-plain');
      this.$markup = $('#howmuchread-markup');
      this.$section = $('#howmuchread-section');
    }
  });

  test('correctly scrolls to the position of the character in the element', function () {
    this.$element.howmuchread('scrollTo', 0);
    ok(Math.abs(this.$element.scrollTop() - 0) <= 5);

    this.$element.howmuchread('scrollTo', 1);
    ok(Math.abs(this.$element.scrollTop() - 0) <= 5);

    this.$element.howmuchread('scrollTo', 49);
    ok(Math.abs(this.$element.scrollTop() - 0) <= 5);

    this.$element.howmuchread('scrollTo', 50);
    ok(Math.abs(this.$element.scrollTop() - 30) <= 5);

    this.$element.howmuchread('scrollTo', 75);
    ok(Math.abs(this.$element.scrollTop() - 30) <= 5);

    this.$element.howmuchread('scrollTo', 100);
    ok(Math.abs(this.$element.scrollTop() - 60) <= 5);

    this.$element.howmuchread('scrollTo', 371);
    ok(Math.abs(this.$element.scrollTop() - 210) <= 5);

    this.$element.howmuchread('scrollTo', 499);
    ok(Math.abs(this.$element.scrollTop() - 270) <= 5);
  });

  test('correctly scrolls to the position of the character in the markuped element', function () {
    this.$markup.howmuchread('scrollTo', 0);
    ok(Math.abs(this.$markup.scrollTop() - 0) <= 5);

    this.$markup.howmuchread('scrollTo', 1);
    ok(Math.abs(this.$markup.scrollTop() - 0) <= 5);

    this.$markup.howmuchread('scrollTo', 49);
    ok(Math.abs(this.$markup.scrollTop() - 0) <= 5);

    this.$markup.howmuchread('scrollTo', 50);
    ok(Math.abs(this.$markup.scrollTop() - 30) <= 5);

    this.$markup.howmuchread('scrollTo', 75);
    ok(Math.abs(this.$markup.scrollTop() - 30) <= 5);

    this.$markup.howmuchread('scrollTo', 100);
    ok(Math.abs(this.$markup.scrollTop() - 60) <= 5);

    this.$markup.howmuchread('scrollTo', 371);
    ok(Math.abs(this.$markup.scrollTop() - 210) <= 5);

    this.$markup.howmuchread('scrollTo', 499);
    ok(Math.abs(this.$markup.scrollTop() - 270) <= 5);
  });

  test('options.noScroll prevents scroll, just simulate.', function () {
    this.$element.howmuchread('scrollTo', 0, {noScroll: true});
    equal(this.$element.scrollTop(), 0);

    this.$element.howmuchread('scrollTo', 100, {noScroll: true});
    equal(this.$element.scrollTop(), 0);

    this.$element.howmuchread('scrollTo', 499, {noScroll: true});
    equal(this.$element.scrollTop(), 0);
  });

  test('options.getMetric returns metric object.', function () {
    var metric;

    metric = this.$element.howmuchread('scrollTo', 0, {getMetric: true});
    equal(typeof metric, 'object');
  });
}(jQuery));
