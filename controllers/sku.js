const _ = require("lodash")
const ErrorCompose = require("./../utils/ErrorCompose")

module.exports = {
  findone: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.sku.findone(_.get(ctx, "params.id"))
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  }
}
