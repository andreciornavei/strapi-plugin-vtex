const _ = require("lodash")
const axios = require("axios")

const VtexHttp = axios.create({
  baseURL: process.env.VTEX_BASEURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'x-vtex-api-appkey': process.env.VTEX_API_KEY,
    'x-vtex-api-apptoken': process.env.VTEX_API_SECRET,
  }
})
VtexHttp.interceptors.request.use(async (config) => {
  if (_.isObject(config.data)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});


module.exports = VtexHttp
