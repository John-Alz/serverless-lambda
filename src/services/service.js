const nequiUtils = require('@nequi/nequi-utils')
const nequiApiUtils = require('@nequi/nequi-api-utils')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES
const env = nequiUtils.Environment
const lambdaUtils = nequiUtils.Lambda8
let nequiDynamoDB = require('@nequi/nequi-aws-dynamodb');


const service = async (event) => {
  try {


    const requestData = event.RequestMessage.RequestBody.any.onboardingTestRQ;
    const region = event.RequestMessage.RequestHeader.Destination.ServiceRegion;


    const tableName = process.env.NEQUI_TABLE_PARAMETERS;

    const key = {
      "key": requestData.key,
      "region": region
    };

    console.log("Key service:", key)

    const result = await nequiDynamoDB.getItem(tableName, key);

    if (!result || (result.Item && Object.keys(result.Item).length === 0)) {
      throw lambdaUtils.buildOutput(true, true,
        getOutput(event,
          RESPONSE_MESSAGES.DATA_NOT_FOUND.CODE,
          RESPONSE_MESSAGES.DATA_NOT_FOUND.DESCRIPTION
        ),
        'Dato no encontrado', 'DynamoDB', null
      )
    }

    console.log('Resultado obtenido:', result.Item);

    return result.Item;

  } catch (error) {
    if (!!error && !!error.output) {
      throw error
    } else {
      throw lambdaUtils.buildOutput(false, true,
        getOutput(event, RESPONSE_MESSAGES.TECHNICAL_ERROR.CODE,
          RESPONSE_MESSAGES.TECHNICAL_ERROR.DESCRIPTION),
        'Sistema que fallo', 'proceso o función', error)
    }
  }
}

const getOutput = (event, code, description, body) => {
  return responseUtils.buildResponseFromRequest(event, code, description, body)
}

module.exports = {
  service: service
}
