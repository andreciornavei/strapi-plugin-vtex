const _ = require("lodash")
module.exports = (ctx, error) => {
  return ctx.send({
    message: _.get(error, "message"),
    data: _.get(error, "response.data", _.get(error, "data", undefined))
  }, _.get(error, "response.status", 400))
}
