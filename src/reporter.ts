import path from 'path';
import fs from 'fs';
import util from 'util';
import chalk from 'chalk';
import uniqid from 'uniqid';
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
 *
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
        console.error(`    ${chalk.red(formatError(log).trim().split('\n').join('\n    '))}\n`);
      });
    }
  });
};

/**
 * Stores a test run in the local history
 *
 * @param config Task config
 * @param testRun Test run
 */
const storeTestRun = (config: TaskConfig, testRun: TestRun): void => {
  const historyDir = path.resolve(config.getProjectRoot(), '.history');
  const historyFile = path.resolve(historyDir, `${uniqid()}.json`);

  // create history dir if it doesn't exist
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir);
  }

  // write history file
  fs.writeFileSync(
    historyFile,
    JSON.stringify(
      { time: Math.round(new Date().getTime() / 1000), ...testRun.toJSON() },
      undefined,
      2,
    ),
  );
};

/**
 * Create a new reporter
 *
 * @param json Whether the output should be in JSON
 */
const Reporter = (json: boolean) => {
  const reporter = function Skills17Reporter(this: CustomReporter, logger: any, formatError: any) {
    const config = new TaskConfig();
    config.loadFromFileSync();

    const testRun: Record<string, TestRun> = {};
    const errors: Record<string, boolean> = {};
    let testFailures: Record<string, KarmaResult[]> = {};

    // create a new test run for each browser
    this.onBrowserStart = function onBrowserStart(browser) {
      testRun[browser.id] = config.createTestRun();
    };

    // save single test result
    this.onSpecComplete = function onSpecComplete(browser: Browser, result: KarmaResult) {
      testRun[browser.id].recordTest(
        concatTestName(result),
        result.description,
        isExtraTest(result),
        result.success,
      );

      // display error messages
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

    // forward console.log statements
    this.onBrowserLog = (browser, log, type) => {
      if (!json) {
        const message = typeof log === 'string' ? log : util.inspect(log, false, undefined, true);
        console.error(`[console.${type.toLowerCase()}] ${message.split('\n').join('\n  ')}`);
      }
    };

    // print result when all tests have been executed
    this.onBrowserComplete = function onBrowserComplete(browser) {
      // if a browser error occurs, no test run will be created
      if (!testRun[browser.id] || errors[browser.id]) {
        return;
      }

      if (json) {
        console.log(`\n${JSON.stringify(testRun[browser.id], undefined, 2)}`);
      } else {
        printTestFailures(formatError, testFailures[browser.id]);
        testFailures = {};
        console.log();

        const printer = new Printer(testRun[browser.id]);
        printer.print();
      }

      if (config.isLocalHistoryEnabled()) {
        storeTestRun(config, testRun[browser.id]);
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
