
const isFunction = require('lodash/isFunction')

const readdirSync = require('./read-dir-sync')


const getFilesInPath = function (path, filter) {
    const dirs = readdirSync(path)
        .filter((v) => {
            return v.isFile()
        })
    if (isFunction(filter)) {
        return dirs.filter(filter)
    }
    return dirs
}


module.exports = getFilesInPath
