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

const Reporter = (json: boolean) =>
  function Skills17Reporter(this: CustomReporter) {
    const task = new TaskConfig();
    task.loadFromFileSync();

    const testRun: Record<string, TestRun> = {};

    this.onSpecComplete = function onSpecComplete(browser: Browser, result: KarmaResult) {
      testRun[browser.id].recordTest(concatTestName(result), isExtraTest(result), result.success);
    };

    this.onBrowserStart = function onBrowserStart(browser) {
      testRun[browser.id] = task.createTestRun();
    };

    this.onBrowserComplete = function onBrowserComplete(browser) {
      if (json) {
        console.log(JSON.stringify(testRun[browser.id], undefined, 2)); // eslint-disable-line no-console
      } else {
        console.log(); // eslint-disable-line no-console

        const printer = new Printer(testRun[browser.id]);
        printer.print({ printFooter: false });
      }
    };
  };

module.exports = {
  'reporter:skills17': ['type', Reporter(false)],
  'reporter:skills17-json': ['type', Reporter(true)],
};
