const _ = require("lodash")
const ErrorCompose = require("../utils/ErrorCompose")

module.exports = {
  register: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.auth.register(
        _.get(ctx, "request.body.firstName"),
        _.get(ctx, "request.body.lastName"),
        _.get(ctx, "request.body.email"),
        _.get(ctx, "request.body.document"),
        _.get(ctx, "request.body.phone"),
        _.get(ctx, "request.body.isNewsletterOptIn"),
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  login: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.auth.login(
        _.get(ctx, "request.body.email"),
        _.get(ctx, "request.body.password")
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  loginFacebook: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.auth.loginFacebook(
        _.get(ctx, "request.body.token")
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  loginGoogle: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.auth.loginGoogle(
        _.get(ctx, "request.body.token")
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  requestReset: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.auth.requestReset(
        _.get(ctx, "request.body.email")
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
  reset: async (ctx) => {
    try {
      const response = await strapi.plugins.vtex.services.auth.reset(
        _.get(ctx, "request.body.login"),
        _.get(ctx, "request.body.authenticationToken"),
        _.get(ctx, "request.body.newPassword"),
        _.get(ctx, "request.body.accessKey"),
      )
      return ctx.send(response)
    } catch (error) {
      return ErrorCompose(ctx, error)
    }
  },
}
