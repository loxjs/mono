
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable prefer-destructuring */

require('@loxjs/extend-native')()

const isString = require('lodash/isString')
const hostEnv = require('@loxjs/host-env')
const Config = require('@loxjs/config')
const error = require('@loxjs/errors')
const loadJSModules = require('@loxjs/load-js-modules')
const Snowflake = require('@loxjs/snowflake')

const getConfigJSONOptionsOfNodeJSApp = function () {
    const config = {
        hostEnv,
    }

    if (hostEnv.type === 'node') {
        const PWD = process.env.PWD
        config.__dirname = PWD

        const path = require('path')
        if (PWD) {
            const packagePath = path.join(PWD, 'package.json')
            const pkg = require(packagePath)
            for (const key of Object.keys(pkg)) {
                config[key] = pkg[key]
            }
        }

        const g = hostEnv.global
        for (const key of Object.keys(g)) {
            config[key] = g[key]
        }

        config.env = process.env.NODE_ENV
    }

    return config
}


/* eslint-disable class-methods-use-this */
const foo = function () {
    const bar = {}


    const initialConfiguration = getConfigJSONOptionsOfNodeJSApp()
    const config = new Config(initialConfiguration)
    Object.defineProperty(bar, 'config', {
        value: config,
    })

    // mount function on bar
    const decorate = function (key, fn) {
        if (isString(key) && key.length > 0) {
            Object.defineProperty(bar, key, {
                value: fn,
            })
        }
    }

    Object.defineProperty(bar, 'decorate', {
        value: decorate,
    })

    Object.defineProperty(bar, 'utils', {
        value: {},
    })

    Object.defineProperty(bar, 'cache', {
        value: {},
    })

    Object.defineProperty(bar, 'stores', {
        value: {},
    })

    bar.error = error
    bar.utils.loadJSModules = loadJSModules
    bar.utils.Snowflake = Snowflake

    return bar
}


module.exports = foo()
