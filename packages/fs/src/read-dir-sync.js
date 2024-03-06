
const { readdirSync } = require('fs')
const path = require('path')

const getCallSite = require('./call-site')


const ignoreDirFiles = [
    '.DS_Store',
    'Thumbs.db',
    'ehthumbs.db',
    'Desktop.ini',
]

const dirs = function (rootPath) {
    if (!path.isAbsolute(rootPath)) {
        const callSites = getCallSite()
        const callerDir = path.dirname(callSites[1].getFileName())
        rootPath = path.resolve(callerDir, rootPath)
    }

    return readdirSync(rootPath, {
        withFileTypes: true,
    }).filter((v) => {
        return !ignoreDirFiles.includes(v.name)
    }).map((v) => {
        v.path = path.resolve(rootPath, v.name)
        return v
    })
}


module.exports = dirs
