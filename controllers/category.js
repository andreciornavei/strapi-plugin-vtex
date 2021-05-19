const _ = require('lodash')

module.exports = {
  list: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.categories.find(_.get(ctx, "params.level"))
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  }
}
