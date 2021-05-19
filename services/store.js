const VtexHttp = require("../utils/VtexHttp");
const { LIST_STORES } = require("../utils/VtexPathMapper");

module.exports = {
  find: async () => {
    const response = await VtexHttp.get(LIST_STORES());
    return response.data || []
  },
}
