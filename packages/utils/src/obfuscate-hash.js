
const obfuscateHash = function (hash) {
    if (!hash) {
        return ''
    }
    return `${ hash.slice(0, 6) }...${ hash.slice(-4) }`
}


module.exports = obfuscateHash
