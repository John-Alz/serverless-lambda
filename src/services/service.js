const nequiUtils = require('@nequi/nequi-utils')
const nequiApiUtils = require('@nequi/nequi-api-utils')
const responseUtils = nequiApiUtils.ResponseAPIUtils
const RESPONSE_MESSAGES = nequiApiUtils.RESPONSE_MESSAGES
const env = nequiUtils.Environment
const lambdaUtils = nequiUtils.Lambda8
let nequiDynamoDB = require('@nequi/nequi-aws-dynamodb');


const service = async (event) => {
  try {
    // Implementar el llamado a elementos externos
    // let data = await nequiDynamo.getItem('table', {id:1});

    console.log('================================');
    console.log('LLEGÓ ESTO AL SERVICIO:', JSON.stringify(event, null, 2));
    console.log('================================');

    let payload = event;

    // Si el evento viene encapsulado en un 'body' string (típico de Lambda Proxy), lo parseamos.
    // Pero si ya es el objeto RequestMessage (como en tu test local), usamos 'event' directo.
    if (event.body && typeof event.body === 'string') {
      payload = JSON.parse(event.body);
    }

    const requestData = payload.RequestMessage.RequestBody.any.onboardingTestRQ;


    const tableName = process.env.NEQUI_TABLE_PARAMETERS;

    const key = {
      "key": requestData.key,
      "region": requestData.region
    };

    console.log('Consultando Dynamo con librería Nequi:', key);


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
