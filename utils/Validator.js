const Failure = require("./Failure")
const { validateAll } = require("indicative/validator")

class ValidationException extends Failure {
  constructor(errors, message) {
    super({
      code: 400,
      message: message || "Bad Request",
      data: errors.reduce((obj, cur, i) => { return { ...obj, [cur.field]: cur.message }; }, {})
    })
  }
}

const Validator = async (data, schema, message) => {
  try {
    await validateAll(data, schema)
  } catch (error) {
    throw new ValidationException(error, message)
  }
}

module.exports = Validator;
