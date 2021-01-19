/* eslint-disable no-undef */

/**
 * Group E
 * Should result in 0.5/2 as one test deducts more points
 */
describe('E', () => {
  it('Foo', () => {
    expect(true).to.equal(true);
  });

  it('MorePoints', () => {
    expect(true).to.equal(false);
  });

  it('Bar', () => {
    expect(true).to.equal(false);
  });

  it('Baz', () => {
    expect(true).to.equal(true);
  });
});
