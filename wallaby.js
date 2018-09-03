module.exports = (wallaby) => ({
  files: [
    'src/**/*.js?(x)',
    'src/**/*.ts?(x)',
    'src/**/*.html',
    { pattern: '__tests__/**/*-spec.ts?(x)', ignore: true },
    { pattern: '__tests__/**/!(*-spec)', instrument: false, load: true },
    { pattern: 'package.json', instrument: false, load: true }
  ],

  tests: [
    '__tests__/**/*-test.ts?(x)'
  ],

  env: {
    type: 'node',
    runner: 'node',
    params: { env: 'wallaby=true' }
  },

  testFramework: 'jest',

  // Enable mock hoisting as same as ts-jest does
  // (https://github.com/kulshekhar/ts-jest#supports-automatic-of-jestmock-calls)
  preprocessors: {
    '**/*.js?(x)': (file) => require('babel-core').transform(
      file.content,
      { sourceMaps: true, filename: file.path, presets: ['babel-preset-jest'] })
  },

  workers: {
    initial: 2,
    regular: 1
  },

  setup: (w) => {
    const path = require('path');

    const jestConfig = {
      resetMocks: true,
      resetModules: true,
      moduleFileExtensions: [
        'js',
        'jsx',
        'json',
        'ts',
        'tsx'
      ],
      moduleNameMapper: {
        ".*releases.json$": path.join(wallaby.localProjectDir, 'static/releases.json'),
      },
      setupTestFrameworkScriptFile: path.join(wallaby.projectCacheDir, 'tests/setup.js'),
      globals: { __JEST_DEV__: true }
    };

    w.testFramework.configure(jestConfig);
  }
});
