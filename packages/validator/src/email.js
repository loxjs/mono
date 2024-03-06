
const isEmail = function (v) {
    return /^\b[a-z_0-9.-]{1,64}@([a-z0-9-]{1,200}.){1,5}[a-z]{1,6}$/i.test(v)
}


module.exports = isEmail
