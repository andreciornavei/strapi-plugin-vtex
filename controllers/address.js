const _ = require("lodash")
const ErrorCompose = require("./../utils/ErrorCompose")

module.exports = {
  find: async (ctx) => {
    try {
      return await strapi.plugins.vtex.services.address.find(_.get(ctx, "state.vtex.user.userId"))
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  findone: async (ctx) => {
    try {
      return await strapi.plugins.vtex.services.address.findone(
        _.get(ctx, "state.vtex.user.userId"),
        _.get(ctx, "params.id")
      )
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  create: async (ctx) => {
    try {
      return await strapi.plugins.vtex.services.address.create(
        _.get(ctx, "state.vtex.user.userId"),
        _.get(ctx, "request.body", {})
      )
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  delete: async (ctx) => {
    try {
      return await strapi.plugins.vtex.services.address.delete(
        _.get(ctx, "state.vtex.user.userId"),
        _.get(ctx, "params.id")
      )
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  update: async (ctx) => {
    try {
      return await strapi.plugins.vtex.services.address.update(
        _.get(ctx, "state.vtex.user.userId"),
        _.get(ctx, "params.id"),
        _.get(ctx, "request.body", {})
      )
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
}
