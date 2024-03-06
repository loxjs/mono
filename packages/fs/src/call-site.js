
const callPath = () => {
    const _prepareStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => {
        return stack
    }
    const stack = new Error().stack.slice(1)
    Error.prepareStackTrace = _prepareStackTrace
    return stack
}

module.exports = callPath
