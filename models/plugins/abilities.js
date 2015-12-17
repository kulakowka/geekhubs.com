'use strict'

const rules = {

  edit: function (user, model) {
    return user._id.equals(model.creator._id) || user.isAdmin
  },

  delete: function (user, model) {
    return user._id.equals(model.creator._id) || user.isAdmin
  }
}

module.exports = exports = function abilitiesPlugin (schema, options) {
  schema.methods.can = function can (rule, model) {
    return rules[rule](this, model)
  }
}
