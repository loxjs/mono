
/* eslint-disable global-require, import/no-dynamic-require */

const fs = require('fs')
const path = require('path')

const {
    callSite: getCallSite,
    readdirSync,
} = require('@loxjs/fs')


const access = function (dir) {
    try {
        return fs.statSync(dir)
    } catch {
        return null
    }
}


const loadJSModules = function ({
    dir,
    autoLoad = false, // auto load js module
} = {}) {
    if (!path.isAbsolute(dir)) {
        const callSites = getCallSite()
        const callerDir = path.dirname(callSites[1].getFileName())
        dir = path.resolve(callerDir, dir)
    }

    const rootStat = access(dir)
    if (rootStat === null) {
        return rootStat
    }

    if (rootStat.isFile()) {
        return require(dir)
    }

    return readdirSync(dir)
        .filter((v) => {
            if (v.isFile()) {
                return path.extname(v.name) === '.js'
            }
            v.path = path.resolve(v.path, 'index.js')
            return access(v.path) !== null
        })
        .map((v) => {
            const filename = v.name
            const extname = path.extname(filename)
            const jsModule = {}
            jsModule.autoLoad = autoLoad
            jsModule.fileExtname = extname
            jsModule.fileName = filename
            jsModule.filePath = v.path
            jsModule.moduleName = filename.substr(0, filename.lastIndexOf(extname))
            jsModule.loadModule = function () {
                return require(v.path)
            }
            jsModule.module = autoLoad === true
                ? jsModule.loadModule()
                : null
            return jsModule
        })
}


module.exports = loadJSModules
