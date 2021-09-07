import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import { executeKarma } from './karma-helpers';

const historyDir = path.resolve(__dirname, 'local-history', '.history');
const disabledHistoryDir = path.resolve(__dirname, 'local-history-disabled', '.history');

describe('local history', () => {
  beforeEach(() => {
    if (fs.existsSync(historyDir)) {
      rimraf.sync(historyDir);
    }
  });

  it('stores a history file for a test run', async () => {
    expect(fs.existsSync(historyDir)).toEqual(false);

    // execute karma in the subdirectory
    await executeKarma('local-history', 'start');

    expect(fs.existsSync(historyDir)).toEqual(true);

    const historyFiles = fs.readdirSync(historyDir);

    expect(historyFiles).toHaveLength(1);

    const file = historyFiles[0];
    const history = JSON.parse(fs.readFileSync(path.resolve(historyDir, file)).toString());

    expect(typeof history.time).toEqual('string');
    expect(history.testResults).toStrictEqual([
      {
        group: 'A.+',
        points: 1,
        maxPoints: 2,
        strategy: 'add',
        manualCheck: false,
        tests: [
          {
            name: 'Foo',
            points: 1,
            maxPoints: 1,
            successful: true,
            required: false,
            manualCheck: false,
          },
          {
            name: 'Bar',
            points: 0,
            maxPoints: 1,
            successful: false,
            required: false,
            manualCheck: false,
          },
        ],
      },
      {
        group: 'B.+',
        points: 1,
        maxPoints: 2,
        strategy: 'add',
        manualCheck: false,
        tests: [
          {
            name: 'Foo',
            points: 1,
            maxPoints: 1,
            successful: true,
            required: false,
            manualCheck: false,
          },
          {
            name: 'Bar',
            points: 0,
            maxPoints: 1,
            successful: false,
            required: false,
            manualCheck: false,
          },
        ],
      },
    ]);
  }, 60000);

  it('is disabled by default', async () => {
    expect(fs.existsSync(disabledHistoryDir)).toEqual(false);

    // execute karma in the subdirectory
    await executeKarma('local-history-disabled', 'start');

    expect(fs.existsSync(disabledHistoryDir)).toEqual(false);
  }, 60000);
});
