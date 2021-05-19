module.exports = class Failure extends Error {
  constructor({
    code,
    message,
    errors,
    data,
  }) {
    super(message)
    this.code = code
    this.message = message
    this.errors = errors
    this.data = data
  }
}
