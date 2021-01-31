/* eslint-disable */

function hello(level) {
  if (level === 'error') {
    console.error('error inside hello()\nsecond line');
  } else {
    console.log('inside hello()');
  }

  return 'world';
}
