
module.exports = function (req) {
    let ip = req.headers['x-real-ip']
          || req.headers['x-forwarded-for']
          || req.connection?.remoteAddress
          || req.socket?.remoteAddress
          || req.connection?.socket?.remoteAddress

    if (ip.indexOf(':') > -1 && ip.indexOf('.') > 0) {
        ip = ip.replace('::ffff:', '')
    }

    return ip
}
