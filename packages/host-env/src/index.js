
const bar = {
    global: null,
    type: null,
}

if (typeof window !== 'undefined') {
    /* eslint-disable no-undef */
    bar.global = window
    /* eslint-enable no-undef */
    bar.type = 'browser'
} else {
    bar.global = global
    bar.type = 'node'
}


module.exports = bar
