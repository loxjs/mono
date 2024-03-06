
const isUndefined = require('lodash/isUndefined')


const Errors = class extends Error {
    constructor (code = 'InternalError', {
        // 内部错误码, 用于开发调试时的错误排查, 在生产环境不会返回该 code.
        // 如 RangeError 错误, 需要将 code 标识为 InternalError, RangeError 作为 internalCode
        internalCode,
        httpCode,
        message,
        fileName,
        lineNumber,
        stack,
        detail,
        data,
    } = {}) {
        message = message || code
        super(message, fileName, lineNumber)

        this.name = '@loxjs/errors' // this.constructor.name
        this.code = code
        this.internalCode = internalCode || code
        if (!isUndefined(httpCode)) {
            this.httpCode = httpCode
        }
        if (!isUndefined(detail)) {
            this.detail = detail
        }
        if (!isUndefined(data)) {
            this.data = data
        }
        if (typeof Components !== 'undefined') {
            this.host = 'browser'
            this.hostClient = 'Firefox'
        } else if (typeof chrome !== 'undefined') { // Mozilla Firefox
            this.host = 'browser'
            this.hostClient = 'Chrome'
        } else if (typeof process !== 'undefined') { // Google Chrome/Node.js
            this.host = 'node'
            this.hostClient = 'Node.js'
        }

        if (!isUndefined(stack)) {
            this.stack = stack
        } else if (this.hostClient === 'Firefox') { // remove one stack level in Firefox
            this.stack = this.stack.substring(this.stack.indexOf('\n') + 1)
        } else if (this.hostClient === 'Chrome' || this.hostClient === 'Node.js') { // remove one stack level in Chrome/Node.js
            this.stack = this.stack.replace(/\n[^\n]*/, '')
        }
    }

    toJSON () {
        const json = {
            name: this.name,
            code: this.code,
            internalCode: this.internalCode,
            message: this.message,
            host: this.host,
            hostClient: this.hostClient,
            stack: this.stack,
        }
        if (!isUndefined(this.httpCode)) {
            json.httpCode = this.httpCode
        }
        if (!isUndefined(this.detail)) {
            json.detail = this.detail
        }
        if (!isUndefined(this.data)) {
            json.data = this.data
        }

        return json
    }

    toSimpleJSON () {
        const json = {
            code: this.code,
            message: this.message,
        }
        if (!isUndefined(this.httpCode)) {
            json.httpCode = this.httpCode
        }
        if (!isUndefined(this.data)) {
            json.data = this.data
        }

        return json
    }

    toString () {
        const json = this.toJSON()
        return JSON.stringify(json)
    }
}


module.exports = Errors
