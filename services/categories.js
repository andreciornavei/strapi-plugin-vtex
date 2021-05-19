const VtexHttp = require("./../utils/VtexHttp")
const { LIST_CATEGORIES } = require("./../utils/VtexPathMapper")

module.exports = {
  find: async (level) => {
    const categories = await VtexHttp.get(`${LIST_CATEGORIES(level)}`);
    return categories.data || []
  }
}
