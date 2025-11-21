const nequiUtils = require('@nequi/nequi-utils')
const nequiApiUtils = require('@nequi/nequi-api-utils')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES
const lambdaUtils = nequiUtils.Lambda8
const Validator = require('jsonschema').Validator

const schema = require('./schema')

module.exports = async (event) => {
  const validator = new Validator()
  let payload = event;

  if (event.body) {
    payload = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  }

  const validatorResponse = validator.validate(payload, schema).errors
  if (validatorResponse.length > 0) {
    console.log("!!! ERROR DE VALIDACIÓN DETECTADO !!!");
    console.log(JSON.stringify(validatorResponse, null, 2));
    throw lambdaUtils.buildOutput(true, true,
      getOutput(event, RESPONSE_MESSAGES.BAD_PARAMETERS.CODE,
        RESPONSE_MESSAGES.BAD_PARAMETERS.DESCRIPTION),
      'taller-serverless', 'validator')
  }
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}
