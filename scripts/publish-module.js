
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable class-methods-use-this */

require('dotenv').config()
const { promisify } = require('util')
const { exec: execCallback } = require('child_process')
const fs = require('fs')
const path = require('path')
const yargs = require('yargs')

const exec = promisify(execCallback)


if (!process.env.NPM_TOKEN) {
    console.error('Error: NPM_TOKEN is not set.\nYou need to set the NPM_TOKEN environment variable in <project-root>/.env to publish the module.')
    process.exit(1)
}

const npmrc = `
registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${ process.env.NPM_TOKEN }
`


const existProcessWithError = function (errMsg) {
    console.error(`Error: ${ errMsg }`)
    process.exit(1)
}

const isGitRepository = async function (directory) {
    // Check if the directory exists
    if (!fs.existsSync(directory)) {
        throw new Error('Directory does not exist')
    }

    // Check if the .git directory exists within the specified directory
    const gitDir = path.join(directory, '.git')
    return fs.existsSync(gitDir) && fs.lstatSync(gitDir).isDirectory()
}

const getGitRemoteURL = async function (directory) {
    if (!(await isGitRepository(directory))) {
        return null // Not a Git repository
    }

    try {
        // Execute 'git remote -v' command to check for remote repositories
        const { stdout } = await exec('git remote -v', { cwd: directory })

        // Parse stdout to find remote URLs
        const remotes = stdout.split('\n').filter(Boolean) // Filter out empty lines
        if (remotes.length === 0) {
            return null // No remotes set
        }

        // Get the URL of the first remote
        const remote = remotes[0].split('\t')[1].split(' ')[0]
        return remote
    } catch (error) {
        // If an error occurs, it's likely because there's no remote set
        return null
    }
}


const PublishModule = class {
    constructor ({
        rootDir,
        workspace = 'packages',
        moduleName = '',
    }) {
        this.rootDir = rootDir
        this.workspace = (workspace || 'packages').trim()
        moduleName = (moduleName || '').trim()
        this.moduleName = moduleName

        this.projectPackageJsonPath = path.join(rootDir, 'package.json')
        this.nodeModulesPath = path.join(rootDir, 'node_modules')
        this.babelPath = path.join(this.nodeModulesPath, '.bin', 'babel')
        this.workspacePath = path.join(rootDir, this.workspace)
        this.modulePath = path.join(this.workspacePath, moduleName)
        this.srcPath = path.join(this.modulePath, 'src')
        this.libPath = path.join(this.modulePath, 'lib')
        this.moduleReadmePath = path.join(this.modulePath, 'README.md')
        this.modulePackageJsonPath = path.join(this.modulePath, 'package.json')
        this.libReadmePath = path.join(this.libPath, 'README.md')
        this.libPackageJsonPath = path.join(this.libPath, 'package.json')
        this.projectReadmeDocPath = null
        this.moduleReadmeDocPath = null
        this.projectHasReadmeDoc = false
        this.moduleHasReadmeDoc = false
        this.gitRemoteURL = null
    }

    async check () {
        const {
            rootDir,
            workspace,
            moduleName,
            modulePackageJsonPath,
            projectPackageJsonPath,
            babelPath,
            workspacePath,
            modulePath,
            srcPath,
        } = this
        if (!moduleName) {
            existProcessWithError('Module name is required')
        }

        if (!fs.existsSync(rootDir)) {
            existProcessWithError(`Directory does not exist:\n  ${ rootDir }`)
        }

        const ifProjectIsGitRepository = await isGitRepository(rootDir)
        if (!ifProjectIsGitRepository) {
            existProcessWithError(`Project is not a Git repository:\n  ${ rootDir }`)
        }

        if (!workspace) {
            existProcessWithError('Workspace is required')
        }

        if (!fs.existsSync(workspacePath)) {
            existProcessWithError(`Workspace does not exist:\n  ${ workspacePath }`)
        }

        const gitRemoteURL = await getGitRemoteURL(rootDir)
        if (!gitRemoteURL) {
            existProcessWithError('No git remote set')
        }
        if (gitRemoteURL.indexOf('github.com') < 0) {
            existProcessWithError(`Git remote is not a GitHub repository:\n  ${ gitRemoteURL }`)
        }
        this.gitRemoteURL = gitRemoteURL

        if (!fs.existsSync(projectPackageJsonPath)) {
            existProcessWithError(`package.json does not exist:\n  ${ projectPackageJsonPath }`)
        }

        if (!fs.existsSync(babelPath)) {
            existProcessWithError(`Babel is not installed in the project:\n  ${ babelPath }`)
        }

        if (!fs.existsSync(modulePath)) {
            existProcessWithError(`Module ${ moduleName } does not exist:\n  ${ modulePath }`)
        }

        if (!fs.existsSync(srcPath)) {
            existProcessWithError(`Module ${ moduleName } does not have a src directory:\n  ${ srcPath }`)
        }

        if (!fs.existsSync(modulePackageJsonPath)) {
            existProcessWithError(`Module ${ moduleName } does not have a package.json:\n  ${ modulePackageJsonPath }`)
        }
    }

    // Transform code using Babel from src to lib
    async buildSrc () {
        const {
            babelPath,
            srcPath,
            libPath,
        } = this

        await exec(`${ babelPath } ${ srcPath } --out-dir ${ libPath }`)
        console.log(`Code transformed and saved to ${ libPath }`)
    }

    // Copy README.md if it exists
    async processReadme () {
        const {
            moduleReadmePath,
            libReadmePath,
        } = this

        if (fs.existsSync(moduleReadmePath)) {
            fs.copyFileSync(moduleReadmePath, libReadmePath)
            console.log('README.md copied to lib directory')
        }
    }

    async processPackageJson () {
        const {
            workspace,
            moduleName,
            projectPackageJsonPath,
            modulePackageJsonPath,
            libPackageJsonPath,
            gitRemoteURL,
            moduleHasReadmeDoc,
        } = this

        // Copy package.json and update it with the git remote
        const projectPackageJson = require(projectPackageJsonPath)
        const packageJson = require(modulePackageJsonPath)

        // Remove devDependencies
        if (packageJson.devDependencies) {
            delete packageJson.devDependencies
        }

        // Set the license and author fields
        packageJson.license = projectPackageJson.license
        packageJson.author = projectPackageJson.author

        // 将git地址替换为https地址
        const gitUrl = gitRemoteURL
            .replace('git@github.com:', 'https://github.com/')

        const repository = packageJson.repository || {}
        repository.type = 'git'
        repository.url = `git+${ gitUrl }`
        repository.directory = `${ workspace }/${ moduleName }`
        packageJson.repository = repository

        const moduleHomepage = moduleHasReadmeDoc
            ? `/tree/main/${ workspace }/${ moduleName }#readme`
            : `/tree/main/${ workspace }/${ moduleName }`
        packageJson.homepage = gitUrl.replace('.git', moduleHomepage)
        packageJson.bugs = packageJson.bugs || {
            url: gitUrl.replace('.git', '/issues'),
        }

        // Write the updated package.json to the lib directory
        fs.writeFileSync(libPackageJsonPath, `${ JSON.stringify(packageJson, null, 4) }\n`)
        console.log('package.json copied to lib directory and updated')
    }

    // Publish to npm
    async publish () {
        const {
            moduleName,
            libPath,
        } = this

        const originalDirectory = process.cwd()
        process.chdir(libPath)
        fs.writeFileSync('.npmrc', npmrc)
        await exec('npm publish . --access=public')
        fs.unlinkSync('.npmrc')
        process.chdir(originalDirectory)
        console.log(`${ moduleName } published to npm`)
    }

    async run () {
        const {
            rootDir,
            modulePath,
        } = this
        await this.check()

        const projectReadmeDocPath = path.join(rootDir, 'README.md')
        if (fs.existsSync(projectReadmeDocPath)) {
            this.projectReadmeDocPath = projectReadmeDocPath
            this.projectHasReadmeDoc = true
        }
        const moduleReadmeDocPath = path.join(modulePath, 'README.md')
        if (fs.existsSync(moduleReadmeDocPath)) {
            this.moduleReadmeDocPath = moduleReadmeDocPath
            this.moduleHasReadmeDoc = true
        }

        await this.buildSrc()
        await this.processReadme()
        await this.processPackageJson()
        await this.publish()
    }
}


async function main () {
    const {
        argv,
    } = yargs
        .command('$0 <module-name>', 'Publish module to npmjs.com', (_yargs) => {
            _yargs
                .positional('module-name', {
                    describe: 'Name of the module to publish',
                    type: 'string',
                })
        })
        .option('help', {
            alias: 'h',
            type: 'boolean',
            description: 'Show help',
        })

    if (argv.help) {
        yargs.showHelp()
        return
    }

    try {
        const rootDir = path.join(__dirname, '..')
        const publishModule = new PublishModule({
            rootDir,
            moduleName: argv.moduleName,
        })
        await publishModule.run()
    } catch (error) {
        console.error(`Error: ${ error }`)
        process.exit(1)
    }
}

main()
