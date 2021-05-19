const _ = require('lodash')
const ErrorCompose = require("../utils/ErrorCompose")

module.exports = {
  cep: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.location.cep(_.get(ctx, "params.cep"))
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  states: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.location.states()
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  cities: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.location.cities(_.get(ctx, "params.uf"))
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  districts: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.location.districts(_.get(ctx, "params.city"))
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
}
