# E2E Testing using BDD framework with Typescript, Cucumber & Protractor
1. Install
npm i
2. Run Test
npm run e2e

## Installation

### Pre-requisites
Nodejs 10.x
Visual studio
protractor: npm -g protractor

### npm packages

protractor,,
cucumber-js,
protractor-cucumber-framework

or run the below command to install all dependencies

```bash
$npm install
```

## Test

To run the test cases use the below command 
```bash
$npm run test
```
or 
```bash
$gulp test
```

## reporter


## Note:
Let check browser version before running then update version in pakage file (package.json)

"postinstall": "cd ./node_modules/protractor && npm i webdriver-manager && webdriver-manager update --versions.chrome 79.0.3945.88",