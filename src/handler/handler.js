const lambdaUtils = require('@nequi/nequi-utils').Lambda8
const nequiApiUtils = require('@nequi/nequi-api-utils')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES

const validateSchema = require('../config/schema/validateSchema')
const processBusiness = require('../business/business')

module.exports = async function defaultHandler(event, context) {
  lambdaUtils.log('Entry event ', JSON.stringify(event))
  try {
    await validateSchema(event)
    const response = await processBusiness(event)
    await lambdaUtils.finish(context, lambdaUtils.buildOutput(true, false,
      getOutput(event, RESPONSE_MESSAGES.SUCCESS.CODE,
        RESPONSE_MESSAGES.SUCCESS.DESCRIPTION, { testRS: response })
    ))
  } catch (error) {
    await lambdaUtils.finish(context, error)
  }
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}
