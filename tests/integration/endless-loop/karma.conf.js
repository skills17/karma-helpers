const config = require('../../../lib');

module.exports = config({
  frameworks: ['mocha', 'chai'],
  plugins: ['karma-mocha', 'karma-chai', 'karma-chrome-launcher'],
  browsers: ['ChromeDockerHeadless'],
  customLaunchers: {
    ChromeDockerHeadless: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox'],
    },
  },

  // set ping timeout higher than message timeout, otherwise they will occur in a random order which is hard to test
  pingTimeout: 30000,
  browserNoActivityTimeout: 10000,
});
