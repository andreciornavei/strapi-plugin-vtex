'use strict';

// Public node modules.
const _ = require('lodash');

module.exports = strapi => {
  return {
    async initialize() {

      // Inject vtex authentication if route contains 'config.policies' attribute
      _.forEach(strapi.plugins['vtex'].config.routes, value => {
        _.set(value, "config", { prefix: "", policies: [] })
        if (_.get(value, 'protected')) {
          value.config.policies.unshift('plugins::vtex.is-authenticated');
        }
      });

      // ************************************************************** //
      // Force to make all route actions enabled on authenticated role  //
      // ************************************************************** //
      // clean all vtex permissions permissions
      try {
        await strapi.query('permission', 'users-permissions').model.where('type', 'vtex').destroy();
      } catch (error) {
        console.log("No rows to delete!")
      }

      // Define permissions for vtex resources
      const vtexRoles = {
        "authenticated": {
          "user": ["findone", "update"],
        },
        "public": {
          "user": ["login"],
          "category": ["list"]
        }
      }

      // ********************************************************* //
      // Allow specific authenticated routes for users-permissions //
      // ********************************************************* //
      const role = await strapi.query('role', 'users-permissions').findOne({ type: "public" })
      if (role) {
        // Re-create rolee
        if (Object.keys(vtexRoles).includes(role.type)) {
          for (const keyController in vtexRoles[role.type]) {
            for (const keyAction of vtexRoles[role.type][keyController]) {
              await strapi.query('permission', 'users-permissions').create({
                type: 'vtex',
                controller: keyController,
                action: keyAction,
                enabled: true,
                policy: "",
                role: role.id
              })
            }
          }
        }
      }

    }
  }
}
