
const Errors = require('./errors')
const errorWrapper = require('./error-wrapper')
const expressError = require('./express-error')


errorWrapper.LoxError = Errors
errorWrapper.expressError = expressError


module.exports = errorWrapper
