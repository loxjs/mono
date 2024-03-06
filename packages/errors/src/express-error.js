
/* eslint-disable no-unused-vars */

const isFunction = require('lodash/isFunction')
const isUndefined = require('lodash/isUndefined')
const getClientIP = require('@loxjs/express-client-ip')

const errorWrapper = require('./error-wrapper')


module.exports = function ({
    isPROD = true,
    errHandler,
    i18n,
}) {
    return function (err, req, res, next) {
        err = errorWrapper(err)
        if (res.headersSent) {
            return next(err)
        }

        if (isFunction(i18n)) {
            const i18nMessage = i18n(err.code)
            if (i18nMessage !== err.code) {
                err.message = i18nMessage
            }
        }

        const request = {
            headers: req.headers,
            url: req.url,
            query: req.query,
            params: req.params,
            body: req.body,
            ip: getClientIP(req),
        }

        err.detail = err.detail || {}
        err.detail.request = request

        const errJSON = err.toJSON()
        if (isFunction(errHandler)) {
            errHandler(errJSON)
        }
        if (isUndefined(err.httpCode) || err.httpCode === 200) {
            res.status(200)
        } else {
            res.status(err.httpCode)
        }
        if (err.httpCode === 400 || err.httpCode === 404) {
            return res.send()
        }
        return res.json(isPROD ? err.toSimpleJSON() : errJSON)
    }
}
