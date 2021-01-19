/* eslint-disable no-undef */

describe('E', () => {
  /**
   * This test does not have an extra test and should trigger a warning.
   */
  it('Foo', () => {
    expect(true).to.equal(true);
  });

  it('Bar', () => {
    expect(true).to.equal(false);
  });
});
