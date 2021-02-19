import fs from 'fs';
import path from 'path';
import stripAnsi from 'strip-ansi';
import { executeKarma, standardizeOutput } from './karma-helpers';

describe('integration tests', () => {
  // get all integration tests
  const integrationTests = fs.readdirSync(__dirname).filter((file) => {
    const fileInfo = fs.statSync(path.resolve(__dirname, file));
    return fileInfo.isDirectory();
  });

  it.each(integrationTests)(
    '%s - console reporter',
    async (test) => {
      // execute karma in the subdirectory
      const { output } = await executeKarma(test, 'start');

      // update expected output if required
      if (process.env.UPDATE_EXPECTED_OUTPUT === '1') {
        fs.writeFileSync(path.resolve(__dirname, test, 'expected.txt'), stripAnsi(output));
      }

      // read expected output
      const expectedOutput = fs.readFileSync(path.resolve(__dirname, test, 'expected.txt'));
      expect(standardizeOutput(output)).toEqual(standardizeOutput(expectedOutput.toString()));
    },
    60000,
  );

  it.each(integrationTests)(
    '%s - json reporter',
    async (test) => {
      // execute karma in the subdirectory
      const { output } = await executeKarma(test, 'start --reporters skills17-json');

      // update expected output if required
      if (process.env.UPDATE_EXPECTED_OUTPUT === '1') {
        fs.writeFileSync(path.resolve(__dirname, test, 'expected.json'), stripAnsi(output));
      }

      // read expected output
      const expectedOutput = fs.readFileSync(path.resolve(__dirname, test, 'expected.json'));

      expect(standardizeOutput(output)).toEqual(standardizeOutput(expectedOutput.toString()));
    },
    60000,
  );
});
