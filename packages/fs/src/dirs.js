
const isFunction = require('lodash/isFunction')

const readdirSync = require('./read-dir-sync')


const getFoldersInPath = function (path, filter) {
    const dirs = readdirSync(path)
        .filter((v) => {
            return v.isDirectory()
        })
    if (isFunction(filter)) {
        return dirs.filter(filter)
    }
    return dirs
}


module.exports = getFoldersInPath
