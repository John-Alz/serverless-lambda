'use strict'
/**
 * @module taller-serverless
 * @description taller-serverless
 * @author jjangel_nequi <jjangel@nequi.com>
 * @version 1.0.0
 * @since 2025-11-20
 * @lastModified 2025-11-20
 */

const srcHandler = require('./src/handler/handler')

exports.handler = async (event, context) => {
  await srcHandler(event, context)
}
