const ErrorCompose = require("./../utils/ErrorCompose")
module.exports = {
  list: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.store.find()
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  }
}
