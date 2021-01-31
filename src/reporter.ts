import TaskConfig from '@skills17/task-config';
import { TestRun } from '@skills17/test-result';
import Printer from '@skills17/test-result-printer';
import { Browser, CustomReporter, KarmaResult } from './types/karma';

const concatTestName = (result: KarmaResult) => {
  const suites = result.suite.filter((suite) => suite !== 'Extra' && suite !== 'extra');

  if (suites.length === 0) {
    return result.description;
  }

  return `${suites.join(' > ')} > ${result.description}`;
};

const isExtraTest = (result: KarmaResult) =>
  result.suite.includes('Extra') || result.suite.includes('extra');

const Reporter = (json: boolean) => {
  const reporter = function Skills17Reporter(this: CustomReporter, logger: any, formatError: any) {
    const task = new TaskConfig();
    task.loadFromFileSync();

    const testRun: Record<string, TestRun> = {};
    const errors: Record<string, boolean> = {};

    // create a new test run for each browser
    this.onBrowserStart = function onBrowserStart(browser) {
      testRun[browser.id] = task.createTestRun();
    };

    // save single test result
    this.onSpecComplete = function onSpecComplete(browser: Browser, result: KarmaResult) {
      testRun[browser.id].recordTest(concatTestName(result), isExtraTest(result), result.success);
    };

    // handle browser errors that do not allow execution of further tests
    this.onBrowserError = function onBrowserError(browser, error) {
      if (json) {
        console.log(JSON.stringify({ error: formatError(error) }, undefined, 2)); // eslint-disable-line no-console
      } else {
        logger
          .create('skills17')
          .error(
            `An unexpected error has occurred and tests cannot be executed.\n${formatError(error)}`,
          );
      }

      errors[browser.id] = true;
    };

    // print result when all tests have been executed
    this.onBrowserComplete = function onBrowserComplete(browser) {
      // if a browser error occurs, no test run will be created
      if (!testRun[browser.id] || errors[browser.id]) {
        return;
      }

      if (json) {
        console.log(JSON.stringify(testRun[browser.id], undefined, 2)); // eslint-disable-line no-console
      } else {
        console.log(); // eslint-disable-line no-console

        const printer = new Printer(testRun[browser.id]);
        printer.print({ printFooter: false });
      }
    };
  };

  reporter.$inject = ['logger', 'formatError'];

  return reporter;
};

module.exports = {
  'reporter:skills17': ['type', Reporter(false)],
  'reporter:skills17-json': ['type', Reporter(true)],
};
