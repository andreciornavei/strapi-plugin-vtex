const _ = require("lodash")
const ErrorCompose = require("./../utils/ErrorCompose")

module.exports = {
  find: async (ctx) => {
    try {
      return await strapi.plugins.vtex.services.wishlist.find(_.get(ctx, "state.vtex.user.userId"))
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  }
}
