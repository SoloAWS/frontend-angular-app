const path = require('path');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-coverage',
      '@angular-devkit/build-angular/plugins/karma'
    ],
    client: {
      clearContext: false
    },
    angularCli: {
      environment: 'dev'
    },
    files: [

    ],
    preprocessors: {
      './src/**/*.js': ['coverage'],
      './src/**/*.ts': ['coverage']
    },
    coverageReporter: {
      dir: path.join(__dirname, './coverage/'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'coverage', 'coveralls'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};
