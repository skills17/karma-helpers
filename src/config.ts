import TaskConfig from '@skills17/task-config';

export default ({ plugins = [], ...overrides }: Record<string, any> = {}): Record<string, any> =>
  (config: any) => {
    const task = new TaskConfig();
    task.loadFromFileSync();

    config.set({
      autoWatch: false,
      basePath: task.getProjectRoot(),
      browsers: ['ChromeHeadless'],
      files: [...task.getSource(), ...task.getTests()],
      hostname:
        !task.getServe().bind || task.getServe().bind === '127.0.0.1'
          ? 'localhost'
          : task.getServe().bind,
      listenAddress: task.getServe().bind ?? '127.0.0.1',
      logLevel: config.LOG_ERROR,
      plugins: [...plugins, require('./reporter')], // eslint-disable-line global-require
      reporters: ['skills17'],
      singleRun: true,
      ...overrides,
    });

    return config;
  };
