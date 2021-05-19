const VtexHttp = require("./../utils/VtexHttp")
const { COLLECTION_FIND, COLLECTION_PRODUCTS_FIND } = require("./../utils/VtexPathMapper")

module.exports = {
  find: async (page, perPage) => {
    const collections = await VtexHttp.get(`${COLLECTION_FIND({
      page: page,
      perPage: perPage
    })}`);
    return collections.data || []
  },
  products: async (page, perPage, collectionId) => {
    const collections = await VtexHttp.get(`${COLLECTION_PRODUCTS_FIND({
      collectionId: collectionId,
      page: page,
      perPage: perPage
    })}`);
    return collections.data || []
  }
}
