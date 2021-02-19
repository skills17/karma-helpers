import path from 'path';
import { exec } from 'child_process';
import stripAnsi from 'strip-ansi';

export const executeKarma = (
  testName: string,
  args: string,
): Promise<{ exitCode: number; output: string }> => {
  return new Promise((resolve) => {
    // execute karma in the subdirectory
    const cmd = exec(`$(npm bin)/karma ${args}`, {
      cwd: path.resolve(__dirname, testName),
      env: { ...process.env, FORCE_COLOR: '0' },
    });

    // catch output
    let output = '';
    cmd.stdout?.on('data', (data) => {
      output += data;
    });
    cmd.stderr?.on('data', (data) => {
      output += data;
    });

    // wait until the process finishes
    cmd.on('exit', (code: number) => resolve({ exitCode: code, output }));
  });
};

export const standardizeOutput = (output: string): string =>
  // remove log prefix with date & time and browser version
  stripAnsi(output)
    .trim()
    .replace(
      /^((\d{2}\s){2})\d{4}\s(\d{2}:){2}\d{2}\.\d{0,3}:(?<level>DEBUG|INFO|WARN|WARNING|ERROR)\s\[[^\]]*\]/gm,
      '$<level>',
    );
