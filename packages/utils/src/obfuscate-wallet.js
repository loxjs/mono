
const obfuscateWallet = function (wallet) {
    if (!wallet) {
        return ''
    }
    return `${ wallet.slice(0, 6) }...${ wallet.slice(-4) }`
}


module.exports = obfuscateWallet
