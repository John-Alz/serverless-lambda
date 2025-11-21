'use strict';
const index = require('../../index.js');
const lambdaTestUtils = require('@nequi/nequi-ci-utils').Lambda8TestUtils;

describe('Pruebas de Integración - Flujo Completo (Handler)', () => {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

  it('index.js: Success test - Debe responder 200 y traer la data', async () => {
    try {
      let response = await lambdaTestUtils.test(index.handler, 'test/success.json');

      console.log('Success Response:', JSON.stringify(response, null, 2));

      expect(response).toBeDefined();
      expect(response.ResponseMessage).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status).toBeDefined();

      expect(response.ResponseMessage.ResponseHeader.Status.StatusCode).toBe("0");

      // const bodyObj = response.ResponseMessage.ResponseBody;

      // const bodyString = JSON.stringify(bodyObj);
      // expect(bodyString).toContain("Finalizar onboarding");

    } catch (error) {
      console.log('ERROR SUCCESS TEST: ', error);
      expect(error).not.toBeDefined();
    }
  });

  it('index.js: Data Not Found test', async () => {
    try {
      const response = await lambdaTestUtils.test(index.handler, 'test/dataNotFound.json');
      console.log('Data Not Found Response:', JSON.stringify(response, null, 2));

      expect(response).toBeDefined();
      expect(response.ResponseMessage).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status.StatusCode).toBe("20-08A");

    } catch (error) {
      console.log('Not Found Response:', JSON.stringify(error, null, 2));
      expect(error).not.toBeDefined();
    }
  });

  it('index.js: Bad Parameters test - Debe responder 400 Bad Request por Schema', async () => {
    try {
      const response = await lambdaTestUtils.test(index.handler, 'test/badParameters.json');
      console.log('Bad Parameters Response:', JSON.stringify(response, null, 2));

      expect(response).toBeDefined();
      expect(response.ResponseMessage).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status).toBeDefined();
      expect(response.ResponseMessage.ResponseHeader.Status.StatusCode).toBe("20-05A");
    } catch (error) {
      console.log('Bad Params Response:', JSON.stringify(error, null, 2));
      expect(error).not.toBeDefined();
    }
  });
});