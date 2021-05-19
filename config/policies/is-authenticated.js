const _ = require("lodash")
const axios = require("axios")
const jwt = require("jsonwebtoken")

module.exports = async (ctx, next) => {
  try {
    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const { authorization } = _.get(ctx, "headers", {})
      if (!authorization) return ctx.unauthorized("This resource must provide a JWT Bearer token.")
      const [bearer, token] = authorization.split(" ")
      if (bearer !== "Bearer") return ctx.unauthorized("Your bearer authentication must provide a `Bearer` prefix.")
      if (!token) return ctx.unauthorized("Your bearer authentication must provide a token.")
      const result = await axios.get(`https://${process.env.VTEX_SCOPE}.vtexcommercestable.com.br/api/vtexid/pub/authenticated/user`, {
        headers: { "Cookie": `VtexIdclientAutCookie_casaevideodigital=${token};` }
      })
      const payload = jwt.decode(token)
      if (_.isNull(result.data) || _.get(payload, "userId") !== _.get(result, "data.userId")) {
        throw new Error("Invalid authenticated user")
      }
      _.set(ctx, "state.vtex.user", payload);
      return await next();
    }
  } catch (err) {
    return ctx.unauthorized("Unauthorized")
  }

  let role
  // Retrieve `public` role.
  if (!role) {
    role = await strapi.query('role', 'users-permissions').findOne({ type: 'public' }, []);
  }

  const route = ctx.request.route;
  const permission = await strapi.query('permission', 'users-permissions').findOne(
    {
      role: role.id,
      type: route.plugin || 'application',
      controller: route.controller,
      action: route.action,
      enabled: true,
    },
    []
  );

  if (!permission) {
    return handleErrors(ctx, undefined, 'forbidden');
  }

  // Execute the policies.
  if (permission.policy) {
    return await strapi.plugins['users-permissions'].config.policies[permission.policy](ctx, next);
  }

  // Execute the action.
  return await next();
}

const handleErrors = (ctx, err = undefined, type) => {
  throw strapi.errors[type](err);
};
