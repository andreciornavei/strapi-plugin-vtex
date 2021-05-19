const _ = require("lodash")
const ErrorCompose = require("./../utils/ErrorCompose")

module.exports = {
  find: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.order.find(
        _.get(ctx, "state.vtex.user.sub"),
        _.get(ctx, "query.page", 1),
        _.get(ctx, "query.per_page", 15),
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  findone: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.order.findone(
        _.get(ctx, "state.vtex.user.userId"),
        _.get(ctx, "params.id"),
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  simulation: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.order.simulation(
        _.get(ctx, "request.body", {}),
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  create: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.order.create(_.get(ctx, "request.body", {}))
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
}
