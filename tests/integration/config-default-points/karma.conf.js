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
});
