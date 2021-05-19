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
  paymentSystem: [
    validations.required(),
    validations.number()
  ],
  paymentGroupName: [
    validations.required(),
    validations.string()
  ],
  installments: [
    validations.required(),
    validations.number()
  ],
  shippingMethod: [
    validations.required()
  ],
  address: [
    validations.required(),
    validations.object()
  ],
  "address.addressType": [
    validations.required(),
    validations.string(),
    validations.in(["residential", "pickup"]),
  ],
  "address.city": [
    validations.required(),
    validations.string()
  ],
  "address.complement": [
    // validations.required(),
    validations.string()
  ],
  "address.country": [
    validations.required(),
    validations.string(),
    validations.in(["BRA"]),
  ],
  "address.geoCoordinate": [
    // validations.required(),
    validations.array(),
    validations.size([2])
  ],
  "address.geoCoordinate.0": [
    validations.required()
  ],
  "address.geoCoordinate.1": [
    validations.required()
  ],
  "address.neighborhood": [
    // validations.required(),
    validations.string()
  ],
  "address.number": [
    validations.required(),
    validations.string()
  ],
  "address.postalCode": [
    validations.required(),
    validations.string()
  ],
  "address.receiverName": [
    // validations.required(),
    validations.string()
  ],
  "address.reference": [
    validations.string()
  ],
  "address.state": [
    validations.required(),
    validations.string()
  ],
  "address.street": [
    validations.required(),
    validations.string()
  ],
  "cc": [
    validations.object(),
    validations.requiredWhen(["paymentGroupName", "creditCardPaymentGroup"])
  ],
  "cc.holderName": [
    validations.required()
  ],
  "cc.cardNumber": [
    validations.required()
  ],
  "cc.validationCode": [
    validations.required()
  ],
  "cc.dueDate": [
    validations.required()
  ],
  "profile.email": [
    validations.required(),
    validations.string(),
    validations.email()
  ],
  "clientProfileData.firstName": [
    validations.required(),
    validations.string(),
  ],
  "clientProfileData.lastName": [
    validations.required(),
    validations.string(),
  ],
  "clientProfileData.document": [
    validations.required(),
    validations.string(),
  ],
  "clientProfileData.phone": [
    validations.required(),
    validations.string(),
  ],
  "clientProfileData.isNewsletterOptIn": [
    validations.boolean(),
  ],

}
