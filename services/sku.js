const _ = require("lodash")
const VtexHttp = require("./../utils/VtexHttp")
const { SKU_FINDONE } = require("./../utils/VtexPathMapper")

module.exports = {
  findone: async (skuId) => {
    const response = await VtexHttp.get(SKU_FINDONE(skuId));
    if (!response.data) throw new Error(`Sku with ${skuId} was not founded`)
    return _.get(response, "data")
  }
}
