const { validations } = require('indicative/validator')

module.exports = {
  login: [
    validations.required(),
    validations.string(),
    validations.email()
  ],
  authenticationToken: [
    validations.required()
  ],
  newPassword: [
    validations.required()
  ],
  accessKey: [
    validations.required()
  ]
}
