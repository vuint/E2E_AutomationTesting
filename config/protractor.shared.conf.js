'use strict';
const argv = require ('yargs').argv;
const fs = require ('fs-extra');
const path = require ('path');

exports.config = {
  allScriptsTimeout: 60000,
  disableChecks: true,
  SELENIUM_PROMISE_MANAGER: false, // for using async await

  beforeLaunch: () => {
    fs.removeSync ('./.tmp');
  },

  onPrepare: () => {
    browser.ignoreSynchronization = true;
    browser.manage ().window ().maximize ();
  },

  framework: 'custom',
  frameworkPath: require.resolve ('protractor-cucumber-framework'),
  cucumberOpts: {
    compiler: 'ts:ts-node/register',
    require: [
      path.resolve (process.cwd (), './**/hooks.ts'),
      path.resolve (process.cwd (), './**/cucumber.config.ts'),
      path.resolve (process.cwd (), './**/*.steps.ts'),
    ],
    format: 'json:.tmp/results.json',
  },
  specs: getFeatureFiles (),

  ignoreUncaughtExceptions: true,

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        metadataKey: 'deviceProperties',
        removeExistingJsonReportFile: true,
        removeOriginalJsonReportFile: true,
        disableLog: true,
        openReportInBrowser: false,
      },
    },
  ],
};

function getFeatureFiles () {
  if (argv.feature) {
    return argv.feature
      .split (',')
      .map (feature => `${process.cwd ()}/features/**/${feature}.feature`);
  }

  return [`${process.cwd ()}/features/**/*.feature`];
}
