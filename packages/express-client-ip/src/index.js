
const getIP = function (req) {
    let ip = req.headers['x-real-ip']
          || req.headers['x-forwarded-for']
          || req.headers['cf-connecting-ip']
          || req.connection?.remoteAddress
          || req.socket?.remoteAddress
          || req.connection?.socket?.remoteAddress

    if (!ip && req?.ips?.length) {
        [ip] = req.ips
    }

    if (!ip) {
        return null
    }

    if (ip.indexOf(':') > -1 && ip.indexOf('.') > 0) {
        ip = ip.replace('::ffff:', '')
    }

    return ip
}


getIP.middleware = function expressClientIp (req, res, next) {
    req.clientIp = getIP(req)
    next()
}

module.exports = getIP
