import TaskConfig from '@skills17/task-config';

export default ({ plugins = [], ...overrides }: Record<string, any> = {}): Record<string, any> =>
  (config: any) => {
    const task = new TaskConfig();
    task.loadFromFileSync();

    config.set({
      autoWatch: false,
      basePath: task.getProjectRoot(),
      browsers: ['ChromeHeadlessSkills17'],
      customLaunchers: {
        ChromeHeadlessSkills17: {
          base: 'ChromeHeadless',
          flags:
            process.env.AWS_LAMBDA === '1'
              ? [
                  '--headless',
                  '--no-sandbox',
                  '--no-zygote',
                  '--disable-setuid-sandbox',
                  '--disable-web-security',
                  '--disable-gpu',
                  '--disable-software-rasterizer',
                  '--disable-dev-shm-usage',
                ]
              : [],
        },
      },
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
