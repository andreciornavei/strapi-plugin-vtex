const _ = require("lodash")
const ErrorCompose = require("../utils/ErrorCompose")

module.exports = {
  findone: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.user.findone(
        _.get(ctx, "state.vtex.user.userId")
      )
      return ctx.send(response)
    } catch (error) {
      console.log(error)
      return ErrorCompose(ctx, error)
    }
  },
  update: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.user.update({
        id: _.get(ctx, 'state.vtex.user.userId'),
        email: _.get(ctx, 'state.vtex.user.sub'),
        ..._.get(ctx, "request.body")
      })
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  }
}
