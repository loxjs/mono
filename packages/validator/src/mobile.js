
const isMobile = function (v) {
    return /(?:^1[3456789]|^9[28])\d{9}$/.test(v)
}


module.exports = isMobile
