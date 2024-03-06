
const isArray = require('lodash/isArray')
const isString = require('lodash/isString')
const isUndefined = require('lodash/isUndefined')
const isPlainObject = require('lodash/isPlainObject')
const express = require('express')


const Foo = class {
    constructor () {
        this.router = express.Router()
        this.cache = {}
        this.cacheArr = []
        this.currPath = null
    }

    path ({
        method = 'get',
        path = '/',
    } = {}) {
        const currPath = Symbol(`${ method } ${ path }`)
        this.cache[currPath] = {
            method,
            path,
            controllers: [],
        }
        this.currPath = currPath
        this.cacheArr.push(this.cache[currPath])
        return this
    }

    controller (controller) {
        const {
            cache,
            currPath,
        } = this
        if (!isUndefined(cache[currPath])) {
            if (isArray(controller)) {
                cache[currPath].controllers.push(...controller)
            } else {
                cache[currPath].controllers.push(controller)
            }
        }
        return this
    }

    generate ({
        method,
        path,
        controllers,
    }) {
        if (controllers.length < 1) {
            return
        }

        const lastOne = controllers.splice(controllers.length - 1)[0]

        const controller = async function (req, res, next) {
            try {
                const data = await lastOne(req)
                if (!isUndefined(req.routerNext)) {
                    const {
                        routerNext,
                    } = req
                    req.routerNext = undefined
                    if (routerNext === true) {
                        return next()
                    }
                    return next(routerNext)
                }
                // 处理 res.location 的需求
                if (isString(req.routerLocation) && req.routerLocation.length > 0) {
                    res.location(req.routerLocation)
                    return res.status(req.routerHTTPStatus || 302).end()
                }
                // 处理 res.redirect 的需求
                if (isString(req.routerRedirect) && req.routerRedirect.length > 0) {
                    return res.redirect(req.routerRedirect)
                }
                // 处理自定义 HTTP Response Headers 的需求
                if (isArray(req.routerResponseHeaders) && req.routerResponseHeaders.length > 0) {
                    for (const header of req.routerResponseHeaders) {
                        res.header(...header)
                    }
                }
                // 处理返回 http error code 的需求
                if (!isUndefined(req.routerHTTPStatus)) {
                    return isUndefined(data)
                        ? res.status(req.routerHTTPStatus).send()
                        : res.status(req.routerHTTPStatus).send(data)
                }
                // 处理返回 HTML 的需求
                if (req.routerResponseType === 'plainHTML') {
                    return res.send(data)
                }
                // 处理返回 XML 的需求
                if (req.routerResponseType === 'xml') {
                    res.header('Content-Type', 'application/xml; charset=utf-8')
                    return res.send(data)
                }
                // 处理返回 js 代码的需求
                if (req.routerResponseType === 'js') {
                    res.header('Content-Type', 'text/javascript; charset=utf-8')
                    return res.type('.js').send(data)
                }
                // 处理返回 csv 代码的需求
                if (req.routerResponseType === 'csv') {
                    res.header('Content-Type', 'text/csv; charset=utf-8')
                    if (req.filename) {
                        let filename = req.filename.toString().trim()
                        if (filename) {
                            filename = filename.toLowerCase().endsWith('.csv')
                                ? filename
                                : `${ filename }.csv`
                            res.attachment(filename)
                        }
                    }
                    return res.type('.csv').send(data)
                }

                // 禁用包装数据. 适用于程序需要自定义 code 或者返回数据中不需要包含 { code: 200 }.
                // 如: 程序需要返回指定 code 的错误, 但又不仅只返回 code, 还需要返回额外的数据,
                // { code: 132, data: { ticket: 'xxx' } }
                if (req.responseRawData === true) {
                    return res.send(data)
                }
                if (isPlainObject(data) && data.__disablePackagingData === true) {
                    data.__disablePackagingData = undefined
                    return res.json(data)
                }

                // 包装数据
                const json = {
                    code: 200,
                }

                if (!isUndefined(data)) {
                    json.data = data
                }

                return res.json(json)
            } catch (err) {
                return next(err)
            }
        }

        controllers.push(controller)

        this.router[method](path, ...controllers)
    }

    end () {
        const {
            cacheArr,
        } = this
        for (const router of cacheArr) {
            this.generate(router)
        }

        return this.router
    }

    use (callback) {
        this.router.use(callback)
    }

    get (path) {
        return this.path({
            path,
        })
    }

    post (path) {
        return this.path({
            method: 'post',
            path,
        })
    }

    put (path) {
        return this.path({
            method: 'put',
            path,
        })
    }

    patch (path) {
        return this.path({
            method: 'patch',
            path,
        })
    }

    delete (path) {
        return this.path({
            method: 'delete',
            path,
        })
    }

    head (path) {
        return this.path({
            method: 'head',
            path,
        })
    }
}


module.exports = Foo
