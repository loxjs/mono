
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
        // modulePathIgnorePatterns: [
        //     `<rootDir>/packages/${ moduleName }/lib/`,
        // ],
    }
})
const pathIgnorePatterns = []
for (const moduleName of modules) {
    pathIgnorePatterns.push(`<rootDir>/packages/${ moduleName }/lib/`)
}

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
        ...pathIgnorePatterns,
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
