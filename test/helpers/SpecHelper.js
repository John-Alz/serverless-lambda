const reporters = require('jasmine-reporters');
let originalTimeout;
let nequiDynamoDB = require('@nequi/nequi-aws-dynamodb');

beforeEach(function () {
  originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

  spyOn(nequiDynamoDB, 'getItem').and.callFake(async (tableName, key) => {
    if (key.key === 'ESTE_ID_NO_EXISTE') {
        return { Item: {} };
    } else if (key.key === 'onboardingTest') {
        return { Item: { key: 'onboardingTest', region: 'C001', message: 'Finalizar onboarding' } };
    } else {
        return { Item: { key: key.key, region: key.region, message: 'Default message' } };
    }
  });
});

afterEach(function () {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
});

let junitReporter = new reporters.JUnitXmlReporter({
  savePath: 'reports',
  filePrefix: 'TEST-',
  consolidateAll: false
});

jasmine.getEnv().addReporter(junitReporter);
