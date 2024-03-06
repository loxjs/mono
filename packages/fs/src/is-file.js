
const { lstatSync } = require('fs')


module.exports = function (path) {
    return lstatSync(path).isFile()
}
