/* eslint-disable no-undef */

describe('A', () => {
  it('Foo', () => {
    expect(true).to.equal(true);
  });

  it('Bar', () => {
    expect(true).to.equal(false);
  });

  /**
   * Because this test fails and is required, group A should award 0 points
   */
  it('Required', () => {
    expect(true).to.equal(false);
  });
});
