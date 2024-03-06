#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */

const shell = require('shelljs')

const babel = './node_modules/.bin/babel'

shell.exec('rm -rf dist && mkdir -p dist/release dist/babeled')
shell.exec(`${ babel } .env.js -d dist/babeled && ${ babel } src -d dist/babeled/src`)
shell.exec('ncc build dist/babeled/src/agent.js -o dist/release')
shell.exec('cp package.json dist/release')
