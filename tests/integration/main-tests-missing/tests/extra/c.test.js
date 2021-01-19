/* eslint-disable no-undef */

describe('Extra', () => {
  describe('C', () => {
    it('Foo', () => {
      expect(true).to.equal(true);
    });

    /**
     * This test does not have a main test and should trigger a warning.
     */
    it('Bar', () => {
      expect(true).to.equal(true);
    });
  });
});
