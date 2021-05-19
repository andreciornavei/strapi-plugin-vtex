const { validations } = require('indicative/validator')

module.exports = {
    firstName: [
        validations.required(),
        validations.string(),
    ],
    lastName: [
        validations.required(),
        validations.string(),
    ],
    email: [
        validations.required(),
        validations.string(),
        validations.email()
    ]
}
