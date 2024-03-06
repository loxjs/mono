
const fs = require('fs').promises
const path = require('path')
// 从 JSON ABI 生成 Function Ids
const {
    toFunctionSignature,
    toFunctionSelector,
    toFunctionHash,
    toEventHash,
    toEventSelector,
    toEventSignature,
} = require('viem')


const compileContractJSON = function (builtJSON) {
    const {
        contractName,
        bytecode,
        abi,
    } = builtJSON

    const functionSignatures = []
    const eventSignatures = []
    const _signatures = []
    const functionToSelectors = {}
    const selectorToFunctions = {}
    const _selectors = []
    const eventToTopics = {}
    const topicToEvents = {}
    const _topics = []
    const _hashes = []

    for (const item of abi) {
        let signature = null
        let selector = null
        let hash = null

        if (item.type === 'event') {
            signature = toEventSignature(item)
            selector = toEventSelector(item)
            hash = toEventHash(item)

            eventToTopics[item.name] = hash
            topicToEvents[hash] = item.name
            eventSignatures.push(signature)

            signature = `${ item.type } ${ signature }`
            selector = `${ selector } ${ signature }`
            hash = `${ hash } ${ signature }`

            _signatures.push(signature)
            _topics.push(selector)
            _hashes.push(hash)
        } else if (item.type === 'function' || item.type === 'constructor') {
            signature = toFunctionSignature(item)
            selector = toFunctionSelector(item)
            hash = toFunctionHash(item)

            functionSignatures.push(signature)
            functionToSelectors[item.name || 'constructor'] = selector
            selectorToFunctions[selector] = item.name || 'constructor'

            signature = `${ item.type } ${ signature }`
            selector = `${ selector } ${ signature }`
            hash = `${ hash } ${ signature }`

            _signatures.push(signature)
            _selectors.push(selector)
            _hashes.push(hash)
        }
    }
    return {
        contractName,
        functionSignatures,
        eventSignatures,
        functionToSelectors,
        selectorToFunctions,
        eventToTopics,
        topicToEvents,
        _signatures,
        _selectors,
        _topics,
        _hashes,
        abi,
        bytecode,
    }
}


const foo = async function ({
    builtJSON,
    compiledPath,
}) {
    const compiledJSON = compileContractJSON(builtJSON)

    const compiledString = JSON.stringify(compiledJSON, null, 4)
    compiledPath = path.join(compiledPath, 'compiled.json')
    await fs.writeFile(compiledPath, compiledString)
    console.log(`compiled.json has been saved to ${ compiledPath }`)
}


module.exports = foo
