
const fs = require('fs').promises
const path = require('path')
const yargs = require('yargs')
const semver = require('semver')
const { spawn } = require('child_process')

function spawnPromise (command, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args)
        let data = ''

        child.stdout.on('data', (chunk) => {
            data += chunk
        })

        child.stderr.on('data', (chunk) => {
            data += chunk
        })

        child.on('close', (code) => {
            if (code === 0) {
                resolve(data)
            } else {
                reject(new Error(`Command failed with exit code ${ code }: ${ command }`))
            }
        })
    })
}

async function exists (filePath) {
    try {
        await fs.access(filePath)
        return true
    } catch {
        return false
    }
}

async function updateVersion (moduleName, version) {
    const modulePath = path.join(__dirname, '..', 'packages', moduleName)
    const packageJsonPath = path.join(modulePath, 'package.json')

    // Check if the module directory exists
    if (!await exists(modulePath)) {
        throw new Error(`Module ${ moduleName } does not exist.`)
    }

    // Check if the package.json exists
    if (!await exists(packageJsonPath)) {
        throw new Error(`package.json for module ${ moduleName } does not exist.`)
    }

    // Read the package.json file
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))
    const currentVersion = packageJson.version

    // Check if the provided version is valid
    let newVersion
    if (['major', 'minor', 'patch'].includes(version)) {
        newVersion = semver.inc(currentVersion, version)
    } else if (semver.valid(version)) {
        if (semver.gt(version, currentVersion)) {
            newVersion = version
        } else {
            throw new Error(`Version ${ version } is not greater than the current version ${ currentVersion }`)
        }
    } else {
        throw new Error(`Invalid version: ${ version }`)
    }

    // Update the version in package.json
    packageJson.version = newVersion
    await fs.writeFile(packageJsonPath, `${ JSON.stringify(packageJson, null, 4) }\n`)

    // Commit the changes
    const commitMsg = `${ moduleName } v${ newVersion }`
    await spawnPromise('git', ['commit', '-am', commitMsg])
    console.log(`Changes committed: ${ commitMsg }`)

    // Set the git tag
    const tagName = `${ moduleName }-v${ newVersion }`
    await spawnPromise('git', ['tag', tagName])
    console.log(`Tag created: ${ tagName }`)

    // Inform Lerna about the new version
    await spawnPromise('lerna', ['version', newVersion, '--yes', '--no-git-tag-version'])
    console.log(`Module ${ moduleName } updated to version ${ newVersion }`)
}

async function main () {
    const {
        argv,
    } = yargs
        .command('$0 <module-name> <module-version>', 'Update module version', (_yargs) => {
            _yargs
                .positional('module-name', {
                    describe: 'Name of the module to update',
                    type: 'string',
                })
                .positional('module-version', {
                    describe: 'New version or version increment (major, minor, patch)',
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
        await updateVersion(argv.moduleName, argv.moduleVersion)
    } catch (error) {
        console.error(`Error: ${ error }`)
        process.exit(1)
    }
}

main()
