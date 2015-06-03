(function ($) {
  module('jQuery.howmuchread', {
    setup: function () {
      this.$element = $('#howmuchread-plain');
      this.$markup = $('#howmuchread-markup');
      this.$section = $('#howmuchread-section');
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

  test('works properly with outer parent', function () {
    var $section = this.$section.find('section.first');

    // default

    strictEqual($section.howmuchread({parent: this.$section}), 0, 'should be zero when on top');

    // scrolled

    this.$section.scrollTop(10);
    strictEqual($section.howmuchread({parent: this.$section}), 50, 'should be on line 1');

    // scrolled over

    this.$section.scrollTop(40);
    strictEqual($section.howmuchread({parent: this.$section}), 50, 'should be read over');

    this.$section.scrollTop(400);
    strictEqual($section.howmuchread({parent: this.$section}), 50, 'should be read over');
  });

  test('works properly with outer offseted parent', function () {
    var $section = this.$section.find('section.second');

    // default

    strictEqual($section.howmuchread({parent: this.$section}), 0, 'should be zero when on top');

    // scrolled

    this.$section.scrollTop(10);
    strictEqual($section.howmuchread({parent: this.$section}), 0, 'should be read none');

    this.$section.scrollTop(50);
    strictEqual($section.howmuchread({parent: this.$section}), 0, 'should be read none');

    this.$section.scrollTop(100);
    strictEqual($section.howmuchread({parent: this.$section}), 0, 'should be read none');

    this.$section.scrollTop(110);
    strictEqual($section.howmuchread({parent: this.$section}), 50, 'should be on line 1');

    this.$section.scrollTop(160);
    strictEqual($section.howmuchread({parent: this.$section}), 100, 'should be on line 2');

    this.$section.scrollTop(310);
    strictEqual($section.howmuchread({parent: this.$section}), 350, 'should be on line 7');

    this.$section.scrollTop(380);
    strictEqual($section.howmuchread({parent: this.$section}), 500, 'should be on line 10');

    // scrolled over

    this.$section.scrollTop(410);
    strictEqual($section.howmuchread({parent: this.$section}), 500, 'should be read over');

    this.$section.scrollTop(500);
    strictEqual($section.howmuchread({parent: this.$section}), 500, 'should be read over');
  });
}(jQuery));
