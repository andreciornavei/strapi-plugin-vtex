const { validations } = require('indicative/validator')

module.exports = {
  email: [
    validations.string(),
    validations.required(),
    validations.email()
  ],
  password: [
    validations.string(),
    validations.required()
  ]
}
