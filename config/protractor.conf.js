'use strict';
const config = require ('./protractor.shared.conf').config;
//config.baseUrl = 'http://zerotohero-automationtesting.azurewebsites.net/';
config.directConnect = true;
config.multiCapabilities = [
  {
    browserName: 'chrome',
    chromeOptions: {
      args: ['disable-infobars'],
    },
    shardTestFiles: false,
    maxInstances: 1,
    deviceProperties: {
      browser: {
        name: 'chrome',
        version: 'latest',
      },
      device: 'test machine',
      platform: {
        name: 'windows',
        version: '10.0',
      },
    },
  },
];

exports.config = config;
