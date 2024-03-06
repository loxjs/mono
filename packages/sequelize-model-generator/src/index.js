
const translateSequelizeModel = require('./translate-schema')


module.exports = function ({
    sequelize,
    modelName,
    attributes,
    options,
}) {
    const schema = translateSequelizeModel(attributes)
    const Model = sequelize.define(modelName, schema, options)
    return Model
}
