
const querystring = require('querystring')
const error = require('@loxjs/errors')
const axios = require('axios')
const tunnel = require('tunnel')


const GoogleAuth = class {
    constructor ({
        // secret: 必选参数, 用于获取用户信息的 secret
        // 数据结构: { client_id: String, client_secret: String, grant_type: String }
        secret = {
            client_id: '',
            client_secret: '',
            grant_type: '',
        },
        // timeout: 可选参数, 默认值: 1000 * 60 * 2
        timeout = 1000 * 60 * 2,
        // proxy: 可选参数, 更多信息查看 https://www.npmjs.com/package/tunnel
        // 数据结构: { protocol: String, host: String, port: Integer, proxyAuth: String, headers: Object }
        proxy,
    } = {}) {
        if (proxy) {
            this.httpsAgent = tunnel.httpsOverHttp({
                proxy,
            })
        }
        this.secret = secret
        this.request = axios.create({
            baseURL: 'https://oauth2.googleapis.com',
            httpsAgent: this.httpsAgent,
            timeout,
        })
    }

    async getUserInfo ({
        code,
        redirect_uri,
    }) {
        const form = {
            code,
            redirect_uri,
            ...this.secret,
        }
        const data = querystring.stringify(form)
        // const httpsAgent = tunnel.httpsOverHttp({
        //     proxy: ,
        // })
        // const result = await axios({
        //     method: 'post',
        //     url: 'https://oauth2.googleapis.com/token',
        //     data,
        //     timeout: 1000 * 60 * 2,
        //     httpsAgent,
        // })
        const result = await this.request({
            method: 'post',
            url: '/token',
            data,
        })

        const { id_token } = result.data
        if (!id_token) {
            throw error('Account.InvalidGoogleAuthToken')
        }

        const userInfo = id_token.split('.')[1]
        const userInfoJson = JSON.parse(atob(userInfo))

        return userInfoJson
    }
}


module.exports = GoogleAuth
