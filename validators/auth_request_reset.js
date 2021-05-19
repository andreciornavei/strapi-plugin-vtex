const { validations } = require('indicative/validator')

module.exports = {
    email: [
        validations.required(),
        validations.string(),
        validations.email()
    ]
}
