const _ = require("lodash")
const ErrorCompose = require("./../utils/ErrorCompose")

module.exports = {
  find: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.collection.find(
        _.get(ctx, "query.page", 1),
        _.get(ctx, "query.per_page", 15),
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  products: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.collection.products(
        _.get(ctx, "query.page", 1),
        _.get(ctx, "query.per_page", 15),
        _.get(ctx, "params.id"),
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  }
}
