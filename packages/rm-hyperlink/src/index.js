
const rmLink = function (str) {
    return str.replace(/(<\/?a[^>]*>)(?!.*\1)/img, '')
}


module.exports = rmLink
