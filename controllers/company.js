const _ = require("lodash")
const ErrorCompose = require("./../utils/ErrorCompose")

module.exports = {
  create: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.company.create(_.get(ctx, "request.body"))
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  }
}
