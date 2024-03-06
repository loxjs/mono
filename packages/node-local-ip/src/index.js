
const os = require('os')


module.exports = function () {
    let IPv4 = ''
    let network

    try {
        network = os.networkInterfaces()

        /**
            mac: en0
            linux: eth0
        */
        const eth = network.eth0 || network.en0

        for (let i = 0; i < eth.length; i += 1) {
            if (eth[i].family === 'IPv4') {
                IPv4 = eth[i].address
            }
        }
    } catch (err) {
        return err
    }

    return IPv4
}
