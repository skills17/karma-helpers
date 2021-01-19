/* eslint-disable no-undef */

describe('B', () => {
  it('Foo', () => {
    expect(true).to.equal(true);
  });

  it('Bar', () => {
    expect(true).to.equal(true);
  });

  /**
   * Because this test fails and is required, group B should award 0 points
   */
  it('Required', () => {
    expect(true).to.equal(false);
  });
});
