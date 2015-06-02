(function ($) {
  module('jQuery#howmuchread', {
    setup: function () {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function () {
    expect(1);
    strictEqual(this.elems.howmuchread(), this.elems, 'should be chainable');
  });

  test('is howmuchread', function () {
    expect(1);
    strictEqual(this.elems.howmuchread().text(), 'howmuchread0howmuchread1howmuchread2', 'should be howmuchread');
  });

}(jQuery));
