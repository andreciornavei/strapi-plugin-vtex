const { validations } = require('indicative/validator')

module.exports = {
    addressName: [
        validations.string()
    ],
    addressType: [
        validations.string(),
        validations.in(["residential"]),
    ],
    city: [
        validations.string()
    ],
    complement: [
        validations.string()
    ],
    country: [
        validations.string(),
        validations.in(["BRA"]),
    ],
    geoCoordinate: [
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
        validations.string()
    ],
    number: [
        validations.string()
    ],
    postalCode: [
        validations.string()
    ],
    receiverName: [
        validations.string()
    ],
    reference: [
        validations.string()
    ],
    state: [
        validations.string()
    ],
    street: [
        validations.string()
    ],
}
