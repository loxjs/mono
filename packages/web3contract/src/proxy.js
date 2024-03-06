
const debug = require('debug')('Contract-Base:Proxy')
const {
    HttpsProxyAgent,
} = require('https-proxy-agent')
const {
    JsonRpcProvider,
    FetchRequest,
} = require('ethers')


const Proxy = class {
    constructor (proxyUrl = '') {
        this.proxyUrl = (proxyUrl || '').trim()
        debug('Instantiating', {
            proxyUrl: this.proxyUrl,
        })
    }

    setProxy (proxyUrl) {
        debug('Setting proxy', {
            proxyUrl,
        })
        this.proxyUrl = (proxyUrl || '').trim()
        debug('Proxy set', {
            proxyUrl: this.proxyUrl,
        })
    }

    getJsonRpcProvider ({
        rpcUrl,
    }) {
        debug('Getting JsonRpcProvider', {
            rpcUrl,
            proxyUrl: this.proxyUrl,
            willUseProxy: !!this.proxyUrl,
        })

        if (this.proxyUrl) {
            const fetchReq = new FetchRequest(rpcUrl)
            fetchReq.agent = new HttpsProxyAgent(this.proxyUrl)
            const provider = new JsonRpcProvider(fetchReq)
            return provider
        }

        return new JsonRpcProvider(rpcUrl)
    }
}

const proxy = new Proxy()


module.exports = proxy
