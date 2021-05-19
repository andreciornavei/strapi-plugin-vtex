const _ = require("lodash")
const VtexHttp = require("./../utils/VtexHttp")
const { AUTOCOMPLETE_PRODUCTS, SEARCH_PRODUCTS, PRODUCT_FINDONE, PRODUCT_VARIATIONS } = require("./../utils/VtexPathMapper")

module.exports = {
  autocomplete: async (searchTerm) => {
    const products = await VtexHttp.get(`${AUTOCOMPLETE_PRODUCTS(searchTerm)}`);
    if (_.get(products, "data")) _.set(products, "data.itemsReturned", _.get(products, "data.itemsReturned", []).filter(item => item.items.length > 0))
    return _.get(products, "data", [])
  },
  search: async (props) => {
    const products = await VtexHttp.get(`${SEARCH_PRODUCTS(props)}`);
    return _.get(products, "data", [])
  },
  findone: async (productId) => {
    const response = await VtexHttp.get(PRODUCT_FINDONE(productId));
    if (!response.data) throw new Error(`Product with ${productId} was not founded`)
    const variations = await VtexHttp.get(PRODUCT_VARIATIONS(productId))
    if (!variations.data) throw new Error(`Was not possible to find variations for product ${productId}`)
    _.set(response, "data.variation", _.get(variations, "data"))
    return _.get(response, "data", [])
  }
}
