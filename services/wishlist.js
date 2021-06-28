const _ = require('lodash');
const VtexHttp = require("./../utils/VtexHttp")
const { SEARCH_USER, WISHLIST_FIND } = require("./../utils/VtexPathMapper")

module.exports = {
    find: async (authUserId) => {
        const user = await VtexHttp.get(`${SEARCH_USER(String(authUserId))}`);
        const userId = _.get(user, "data.0.id");
        const wishlist = await VtexHttp.get(`${WISHLIST_FIND(userId)}`)
        return wishlist.data || []
    }
}