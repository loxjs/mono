
const shelljs = require('shelljs')


const fn = function (path, filter) {
    let res = shelljs.exec(`find ${ path } -name "${ filter }"`)

    if (res.code === 0) {
        res = res.stdout.replace(new RegExp(path, 'ig'), '.')
        res = res.split('\n')
        res.length -= 1

        return res
    }

    return { error: true }
}


module.exports = fn
