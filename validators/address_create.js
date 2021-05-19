const { validations } = require('indicative/validator')

module.exports = {
    addressName: [
        validations.required(),
        validations.string()
    ],
    addressType: [
        validations.required(),
        validations.string(),
        validations.in(["residential"]),
    ],
    city: [
        validations.required(),
        validations.string()
    ],
    complement: [
        validations.required(),
        validations.string()
    ],
    country: [
        validations.required(),
        validations.string(),
        validations.in(["BRA"]),
    ],
    geoCoordinate: [
        validations.required(),
        validations.array(),
        validations.size([2])
    ],
    "geoCoordinate.0": [
        validations.required()
    ],
    "geoCoordinate.1": [
        validations.required()
    ],
    neighborhood: [
        validations.required(),
        validations.string()
    ],
    number: [
        validations.required(),
        validations.string()
    ],
    postalCode: [
        validations.required(),
        validations.string()
    ],
    receiverName: [
        validations.required(),
        validations.string()
    ],
    reference: [
        validations.string()
    ],
    state: [
        validations.required(),
        validations.string()
    ],
    street: [
        validations.required(),
        validations.string()
    ],
}
