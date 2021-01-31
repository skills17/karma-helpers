/* eslint-disable no-undef */

describe('A', () => {
  it('Foo', () => {
    expect(hello()).to.equal('world');
  });

  it('Bar', () => {
    expect(hello('error')).to.not.equal('world');
  });
});
