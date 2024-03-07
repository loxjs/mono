
const fs = require('fs')
const path = require('path')

// 获取packages目录下所有的module目录
const packagesDir = path.resolve(__dirname, 'packages')
const modules = fs.readdirSync(packagesDir).filter((file) => {
    return fs.statSync(path.join(packagesDir, file)).isDirectory()
})

// 为每个module生成一个Jest项目配置
const projects = modules.map((moduleName) => {
    return {
        displayName: moduleName,
        testMatch: [`<rootDir>/packages/${ moduleName }/tests/**/*.test.js`],
        // 在这里可以添加更多的配置项
    }
})

module.exports = {
    // 全局配置
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/lib/',
    ],
    modulePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/lib/',
    ],
    collectCoverage: true,
    coverageDirectory: '<rootDir>/coverage/',
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/lib/',
    ],
    coverageReporters: [
        'text',
        'lcov',
    ],

    // 项目特定配置
    projects,
}
