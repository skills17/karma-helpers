/* eslint-disable no-undef */

/**
 * Group A
 * Should result in 2/3 as ABar deducts 1 point
 */
describe('A', () => {
  it('Foo', () => {
    expect(true).to.equal(true);
  });

  it('Bar', () => {
    expect(true).to.equal(false);
  });

  it('Baz', () => {
    expect(true).to.equal(true);
  });
});
