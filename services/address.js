const _ = require('lodash');
const Failure = require('../utils/Failure');
const VtexHttp = require("./../utils/VtexHttp")
const { SEARCH_USER, SEARCH_ADDRESSESS, ADDRESS_FINDONE, ADDRESS_DELETE, ADDRESS_CREATE, ADDRESS_PATCH } = require("./../utils/VtexPathMapper")
const addressCreateValidations = require("./../validators/address_create")
const addressUpdateValidations = require("./../validators/address_update")
const Validator = require("../utils/Validator")

module.exports = {
  find: async (authUserId) => {
    const user = await VtexHttp.get(`${SEARCH_USER(String(authUserId))}`);
    const userId = _.get(user, "data.0.id");
    const addresses = await VtexHttp.get(`${SEARCH_ADDRESSESS(userId)}`)
    return addresses.data || []
  },
  findone: async (userId, addressId) => {
    const customer = await strapi.plugins.vtex.services.user.findone(userId);
    const address = await VtexHttp.get(`${ADDRESS_FINDONE(addressId)}`);
    if (_.get(customer, "id") != _.get(address, "data.0.userId")) {
      throw new Failure({ code: 403, message: "This record dos not belongs to you" })
    }
    return _.get(address, "data.0")
  },
  delete: async (userId, addressId) => {
    const address = await strapi.plugins.vtex.services.address.findone(userId, addressId)
    if (!address) throw new Failure({ code: 400, message: "Address not found" })
    await VtexHttp.delete(`${ADDRESS_DELETE(addressId)}`);
    return { success: true }
  },
  create: async (userId, address) => {
    const customer = await strapi.plugins.vtex.services.user.findone(userId);
    const payload = {
      userId: _.get(customer, "id"),
      city: _.get(address, "city"),
      state: _.get(address, "state"),
      number: _.get(address, "number"),
      street: _.get(address, "street"),
      country: _.get(address, "country"),
      reference: _.get(address, "reference"),
      postalCode: _.get(address, "postalCode"),
      complement: _.get(address, "complement"),
      addressName: _.get(address, "addressName"),
      addressType: _.get(address, "addressType"),
      receiverName: _.get(address, "receiverName"),
      neighborhood: _.get(address, "neighborhood"),
      geoCoordinate: _.get(address, "geoCoordinate"),
    }
    await Validator(payload, addressCreateValidations, "Alguns campos parecem estar incorretos")
    const response = await VtexHttp.post(ADDRESS_CREATE(), payload);
    return {
      ...payload,
      id: _.get(response, "data.DocumentId")
    }
  },
  update: async (userId, addressId, address) => {
    const loadedAddress = await strapi.plugins.vtex.services.address.findone(userId, addressId)
    const payload = {}
    if (_.get(address, "city")) _.set(payload, "city", _.get(address, "city"))
    if (_.get(address, "state")) _.set(payload, "state", _.get(address, "state"))
    if (_.get(address, "number")) _.set(payload, "number", _.get(address, "number"))
    if (_.get(address, "street")) _.set(payload, "street", _.get(address, "street"))
    if (_.get(address, "country")) _.set(payload, "country", _.get(address, "country"))
    if (_.get(address, "reference")) _.set(payload, "reference", _.get(address, "reference"))
    if (_.get(address, "postalCode")) _.set(payload, "postalCode", _.get(address, "postalCode"))
    if (_.get(address, "complement")) _.set(payload, "complement", _.get(address, "complement"))
    if (_.get(address, "addressName")) _.set(payload, "addressName", _.get(address, "addressName"))
    if (_.get(address, "addressType")) _.set(payload, "addressType", _.get(address, "addressType"))
    if (_.get(address, "receiverName")) _.set(payload, "receiverName", _.get(address, "receiverName"))
    if (_.get(address, "neighborhood")) _.set(payload, "neighborhood", _.get(address, "neighborhood"))
    if (_.get(address, "geoCoordinate")) _.set(payload, "geoCoordinate", _.get(address, "geoCoordinate"))
    await Validator(payload, addressUpdateValidations, "Alguns campos parecem estar incorretos")
    await VtexHttp.patch(ADDRESS_PATCH(addressId), payload);
    return {
      success: {
        ...loadedAddress,
        ...payload,
      }
    }
  },
}
