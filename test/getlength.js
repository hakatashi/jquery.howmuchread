(function ($) {
  module('jQuery.howmuchread(\'getLength\')', {
    setup: function () {
      this.$element = $('#howmuchread-plain');
      this.$markup = $('#howmuchread-markup');
      this.$section = $('#howmuchread-section');
    }
  });

  test('correctly gets total count of characters of element', function () {
    strictEqual(this.$element.howmuchread('getLength'), 500);
    strictEqual(this.$element.children().first().howmuchread('getLength'), 50);
    strictEqual(this.$element.children().last().howmuchread('getLength'), 50);
  });

  test('correctly gets total count of characters of markuped element', function () {
    strictEqual(this.$markup.howmuchread('getLength'), 500);
    strictEqual(this.$markup.children().first().howmuchread('getLength'), 50);
    strictEqual(this.$markup.children().last().howmuchread('getLength'), 50);
  });
}(jQuery));
