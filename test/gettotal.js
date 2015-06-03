(function ($) {
  module('jQuery.gettotalchars', {
    setup: function () {
      this.$element = $('#howmuchread-gettotal');
    }
  });

  test('is countable', function () {
    strictEqual(this.$element.gettotalchars(), 500);
    strictEqual(this.$element.children().first().gettotalchars(), 50);
    strictEqual(this.$element.children().last().gettotalchars(), 50);
  });

  test('is countable with bundle of elements', function () {
    strictEqual(this.$element.children().gettotalchars(), 500);
    strictEqual(this.$element.children().first().add(this.$element.children().last()).gettotalchars(), 100);
    strictEqual(this.$element.children().first().addBack().gettotalchars(), 500);
  });
}(jQuery));
