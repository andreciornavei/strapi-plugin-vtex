const axios = require("axios")
module.exports = async (accessToken) => {
  const data = await axios.post(`https://accounts.google.com/o/oauth2/token`, {
    body: {
      grant_type: "authorization_code",
      client_id: process.env.GOOGLE_APP_KEY,
      client_secret: process.env.GOOGLE_APP_SECRET,
      redirect_uri: `https://vtexid.vtex.com.br/VtexIdAuthSiteKnockout/ReceiveAuthorizationCode.ashx`,
      code: accessToken,
    }
  })
  return data.data
}
