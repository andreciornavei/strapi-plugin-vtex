const { validations } = require('indicative/validator')

module.exports = {
  items: [
    validations.required(),
    validations.array(),
    validations.min([1])
  ],
  "items.*.id": [
    validations.required(),
    validations.string(),
  ],
  "items.*.quantity": [
    validations.required(),
    validations.number(),
  ],
  "items.*.seller": [
    validations.required(),
    validations.string(),
  ],
  postalCode: [
    validations.required(),
    validations.string(),
  ],
  country: [
    validations.required(),
    validations.string(),
  ]
}
