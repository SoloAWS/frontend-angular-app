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
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    angularCli: {
      environment: 'dev'
    },
    preprocessors: {
      './src/**/*.ts': ['coverage'] // Only process TypeScript files for coverage
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/'),
      subdir: '.',
      reporters: [
        { type: 'html' }, // Generates an HTML report
        { type: 'lcov', subdir: '.' }, // Generates lcov.info
        { type: 'text-summary' } // Summary in console
      ]
    },
    reporters: ['progress', 'coverage'], // You may omit coveralls unless you need it
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};
