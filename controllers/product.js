const _ = require("lodash")
const ErrorCompose = require("./../utils/ErrorCompose")

module.exports = {
  search: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.product.search({
        searchTerm: _.get(ctx, "query.searchTerm"),
        filterBy: _.get(ctx, "query.filterBy"),
        filterValue: _.get(ctx, "query.filterValue"),
        filterValueTo: _.get(ctx, "query.filterValueTo"),
        orderBy: _.get(ctx, "query.orderBy"),
        orderType: _.get(ctx, "query.orderType"),
        page: _.get(ctx, "query.page", 1),
        perPage: _.get(ctx, "query.per_page", 15),
      })
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  autocomplete: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.product.autocomplete(_.get(ctx, "query.searchTerm"))
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  findone: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.product.findone(_.get(ctx, "params.id"))
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  }
}
