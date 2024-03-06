
/* eslint-disable class-methods-use-this */

const isFunction = require('lodash/isFunction')
const axios = require('axios')


const retryableHttpNetworkErrors = [
    'RETRY', // 自定义错误 code, 用于业务逻辑错误时发起重试请求
    // 'EBADF', // socket 不是有效的文件描述符
    // 'ENOTSOCK', // 文件描述符 socket 不是 socket
    // 'EADDRNOTAVAIL', // 指定的地址在远程机器上不可用
    // 'EAFNOSUPPORT', // socket 不支持 addr 的命名空间
    // EISCONN, // socket 已经连接
    'EPIPE', // broken pipe, 管道破裂
    'ETIMEDOUT', // 连接超时
    'ECONNREFUSED', // 服务器主动拒绝建立连接
    'ENETUNREACH', // 从本机到给定 addr 的网络不通
    // 'EADDRINUSE', // 给定 addr 的 socket 地址已经在使用
    // 'EINPROGRESS', // socket 是非阻塞的，连接不能立即建立
    // 'EALREADY', // socket 是非阻塞的而且有一个挂起的连接
    'ENOTFOUND', // dns 解析问题
    'ECONNABORTED', // software caused connection abort, 软件引起的连接中止
    'ECONNRESET', // connection reset by peer, 对方复位连接
]

const formatterError = function (error) {
    const err = new Error()
    err.code = error.code
    err.status = error.response ? error.response.status : ''
    err.message = error.message
    err.syscall = error.syscall
    err.address = error.address
    err.port = error.port
    err.config = error.config
    err.stack = error.stack

    if (retryableHttpNetworkErrors.includes(err.code)) {
        err.retryable = true
    }

    return err
}

const baseRequestInterceptor = function (config) {
    return config
}

const baseResponseInterceptor = function (res) {
    return res.data
}


module.exports = function (baseConf = {}, {
    requestInterceptor,
    responseInterceptor,
    errorInterceptor,
} = {}) {
    baseConf = {
        timeout: 5000,
        ...baseConf,
    }
    baseConf.headers = baseConf.headers || {}
    baseConf.headers['Content-Type'] = baseConf.headers['Content-Type'] || 'application/json'

    requestInterceptor = isFunction(requestInterceptor)
        ? requestInterceptor
        : baseRequestInterceptor

    const instance = axios.create(baseConf)
    const handleHTTPError = isFunction(errorInterceptor)
        ? function (err) {
            const error = formatterError(err)
            return errorInterceptor(error)
        }
        : function (err) {
            return Promise.reject(formatterError(err))
        }
    instance.interceptors.request.use(requestInterceptor, handleHTTPError)
    instance.interceptors.response.use(baseResponseInterceptor, handleHTTPError)

    if (isFunction(responseInterceptor)) {
        instance.interceptors.response.use(responseInterceptor)
    }

    return instance
}
