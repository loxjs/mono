
/* eslint-disable no-undef-init */

const isFunction = require('lodash/isFunction')
const isString = require('lodash/isString')
const isPlainObject = require('lodash/isPlainObject')

const Errors = require('./errors')

let _i18n = function (errCode) {
    return errCode
}


// optionsOrErrorMessage is [String]message of [Object]options
const errorWrapper = function (loxErrorCodeOrNativeErrorEntity, optionsOrErrorMessage = {}) {
    let internalCode = undefined
    let httpCode = undefined
    let message = undefined
    let fileName = undefined
    let lineNumber = undefined
    let stack = undefined
    let detail = undefined
    let data = undefined

    if (isString(optionsOrErrorMessage)) {
        message = optionsOrErrorMessage
    } else if (isPlainObject(optionsOrErrorMessage)) {
        internalCode = optionsOrErrorMessage.internalCode
        httpCode = optionsOrErrorMessage.httpCode
        message = optionsOrErrorMessage.message
        fileName = optionsOrErrorMessage.fileName
        lineNumber = optionsOrErrorMessage.lineNumber
        stack = optionsOrErrorMessage.stack
        detail = optionsOrErrorMessage.detail
        data = optionsOrErrorMessage.data
    }


    if (loxErrorCodeOrNativeErrorEntity instanceof Errors) {
        return loxErrorCodeOrNativeErrorEntity
    }

    if (loxErrorCodeOrNativeErrorEntity instanceof Error) {
        const err = loxErrorCodeOrNativeErrorEntity
        const code = 'InternalError'
        internalCode = 'InternalError'

        if (err instanceof EvalError) {
            internalCode = 'EvalError'
        } else if (err instanceof RangeError) {
            internalCode = 'RangeError'
        } else if (err instanceof ReferenceError) {
            internalCode = 'ReferenceError'
        } else if (err instanceof SyntaxError) {
            internalCode = 'SyntaxError'
        } else if (err instanceof TypeError) {
            internalCode = 'TypeError'
        } else if (err instanceof URIError) {
            internalCode = 'URIError'
        }

        return new Errors(code, {
            code: 'InternalError',
            internalCode,
            message: err.message,
            fileName: err.fileName,
            lineNumber: err.lineNumber,
            stack: err.stack,
        })
    }

    if (!message) {
        message = _i18n(loxErrorCodeOrNativeErrorEntity)
    }

    return new Errors(loxErrorCodeOrNativeErrorEntity, {
        internalCode,
        httpCode,
        message,
        fileName,
        lineNumber,
        stack,
        detail,
        data,
    })
}

errorWrapper.setI18n = function (i18nFunc) {
    if (isFunction(i18nFunc)) {
        _i18n = i18nFunc
    }
}


module.exports = errorWrapper
