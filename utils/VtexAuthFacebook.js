const FB = require("fb")

module.exports = async (accessToken) => {
  return new Promise((resolve, reject) => {
    FB.options({
      version: 'v8.0',
      appId: process.env.FACEBOOK_APP_KEY,
      appSecret: process.env.FACEBOOK_APP_SECRET
    });
    FB.setAccessToken(accessToken);
    FB.api('me', { fields: ['id', 'name', 'email'] }, function (res) {
      if (!res || res.error)
        reject(res.error);
      else
        resolve(res);
    });
  })
}
