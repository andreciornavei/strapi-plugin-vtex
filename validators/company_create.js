const { validations } = require('indicative/validator')

module.exports = {
  id: [
    validations.string()
  ],
  name: [
    validations.required(),
    validations.string()
  ],
  empresa: [
    validations.required(),
    validations.string()
  ],
  email: [
    validations.required(),
    validations.string(),
    validations.email(),
  ],
  phone: [
    validations.required(),
    validations.string(),
  ],
  description: [
    validations.required(),
    validations.string(),
  ],
}
