(function ($) {
  module('jQuery.howmuchread', {
    setup: function () {
      this.$element = $('#howmuchread-plain');
      this.$markup = $('#howmuchread-markup');
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

    // scrolled over

    this.$element.scrollTop(400);
    strictEqual(this.$element.howmuchread(), 500, 'should be on line 10');
  });

  test('does not break DOM', function () {
    // scramble
    for (var i = 0; i < 20; i++) {
      this.$element.scrollTop(Math.floor(Math.random() * 500)).howmuchread();
    }

    expect(30);

    this.$element.find('p').each(function () {
      var contents = $(this).contents();
      strictEqual(contents.length, 1, 'have one child');
      strictEqual(contents[0].nodeType, 3, 'and it\'s text node');
      strictEqual(contents[0].nodeValue, 'Hello, world! This line consists of 50 characters.', 'and the content is ok');
    });
  });

  test('works properly with markups', function () {
    this.$markup.scrollTop(10);
    strictEqual(this.$markup.howmuchread(), 50, 'should be on line 1');

    this.$markup.scrollTop(60);
    strictEqual(this.$markup.howmuchread(), 100, 'should be on line 2');

    this.$markup.scrollTop(130);
    strictEqual(this.$markup.howmuchread(), 250, 'should be on line 5');

    this.$markup.scrollTop(190);
    strictEqual(this.$markup.howmuchread(), 350, 'should be on line 7');

    this.$markup.scrollTop(250);
    strictEqual(this.$markup.howmuchread(), 450, 'should be on line 9');
  });
}(jQuery));
