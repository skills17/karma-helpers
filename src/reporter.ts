import chalk from 'chalk';
import TaskConfig from '@skills17/task-config';
import { TestRun } from '@skills17/test-result';
import Printer from '@skills17/test-result-printer';
import { Browser, CustomReporter, KarmaResult } from './types/karma';

/* eslint-disable no-console */

/**
 * Concatenates the test name with its suites
 *
 * @param result Test result
 */
const concatTestName = (result: KarmaResult, includeExtra = false) => {
  const suites = includeExtra
    ? result.suite
    : result.suite.filter((suite) => suite !== 'Extra' && suite !== 'extra');

  if (suites.length === 0) {
    return result.description;
  }

  return `${suites.join(' > ')} > ${result.description}`;
};

/**
 * Check if the given test is an extra test
 *
 * @param result Test result
 */
const isExtraTest = (result: KarmaResult) =>
  result.suite.includes('Extra') || result.suite.includes('extra');

/**
 * Print test failures with specific error messages
 * @param results Test results
 */
const printTestFailures = (formatError: any, results?: KarmaResult[]) => {
  if (!results || results.length === 0) {
    return;
  }

  console.error();
  console.error(chalk.bold.underline.red('FAILED TESTS:'));
  console.error();

  results.forEach((result) => {
    console.error(`  ${concatTestName(result, true)}`);
    if (result.log && Array.isArray(result.log)) {
      result.log.forEach((log) => {
        console.error(`    ${chalk.red(formatError(log).split('\n').join('\n    '))}`);
      });
    }
  });
};

/**
 * Create a new reporter
 *
 * @param json Whether the output should be in JSON
 */
const Reporter = (json: boolean) => {
  const reporter = function Skills17Reporter(this: CustomReporter, logger: any, formatError: any) {
    const task = new TaskConfig();
    task.loadFromFileSync();

    const testRun: Record<string, TestRun> = {};
    const errors: Record<string, boolean> = {};
    const testFailures: Record<string, KarmaResult[]> = {};

    // create a new test run for each browser
    this.onBrowserStart = function onBrowserStart(browser) {
      testRun[browser.id] = task.createTestRun();
    };

    // save single test result
    this.onSpecComplete = function onSpecComplete(browser: Browser, result: KarmaResult) {
      testRun[browser.id].recordTest(concatTestName(result), isExtraTest(result), result.success);

      if (!result.success) {
        if (!testFailures[browser.id]) {
          testFailures[browser.id] = [];
        }

        testFailures[browser.id].push(result);
      }
    };

    // handle browser errors that do not allow execution of further tests
    this.onBrowserError = function onBrowserError(browser, error) {
      if (json) {
        console.log(JSON.stringify({ error: formatError(error) }, undefined, 2));
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
        console.log(JSON.stringify(testRun[browser.id], undefined, 2));
      } else {
        printTestFailures(formatError, testFailures[browser.id]);
        console.log();

        const printer = new Printer(testRun[browser.id]);
        printer.print();
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
