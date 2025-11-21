const nequiUtils = require('@nequi/nequi-utils')
const nequiApiUtils = require('@nequi/nequi-api-utils')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES
const lambdaUtils = nequiUtils.Lambda8
const Validator = require('jsonschema').Validator

const schema = require('./schema')

module.exports = async (event) => {
  const validator = new Validator()
  const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  const validatorResponse = validator.validate(body, schema).errors
  if (validatorResponse.length > 0) {
    throw lambdaUtils.buildOutput(400, true,
      getOutput(event, RESPONSE_MESSAGES.BAD_PARAMETERS.CODE,
        RESPONSE_MESSAGES.BAD_PARAMETERS.DESCRIPTION),
      'taller-serverless', 'validator')
  }
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}
