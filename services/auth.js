const _ = require("lodash")
const FB = require("fb")
const axios = require("axios")
const VtexHttp = require("./../utils/VtexHttp")
const Failure = require("../utils/Failure")
const Validator = require("./../utils/Validator")
const AuthLoginValidations = require("../validators/auth_login")
const AuthRequestResetValidations = require("../validators/auth_request_reset")
const AuthResetValidations = require("./../validators/auth_reset")
const AuthRegisterValidations = require("./../validators/auth_registration")
const {
  AUTH_SESSION,
  AUTH_VALIDATION,
  SEARCH_USER,
  UPDATE_USER,
  SEND_EMAIL_ACCESS_KEY,
  RESET_PASSWORD,
  CUSTOMER_CREATION
} = require("./../utils/VtexPathMapper")

module.exports = {
  register: async (firstName, lastName, email, document, phone, isNewsletterOptIn) => {

    /********************************************/
    /* Validate input data                     */
    /********************************************/
    const payload = { firstName, lastName, email, document, phone, isNewsletterOptIn }
    await Validator(payload, AuthRegisterValidations, "Invalid input data, review errors below.")
    /*********************************************/
    /* Create a new customer on Vtext MasterData */
    /*********************************************/
    const resultUser = await VtexHttp.post(CUSTOMER_CREATION(), payload)
    if (_.get(resultUser, "status") != 201) {
      throw new Failure({
        code: _.get(resultUser, "status"),
        message: _.get(resultUser, "response.data.Message")
      })
    }

    /***********************************************************/
    /* Call request reset password for created customer email  */
    /***********************************************************/
    return await strapi.plugins.vtex.services.auth.requestReset(email)

  },
  requestReset: async (email) => {

    /********************************************/
    /* Validate input email                     */
    /********************************************/
    const payload = { email: email }
    await Validator(payload, AuthRequestResetValidations, "Invalid input data, review errors below.")

    /********************************************/
    /* Initialize Vtex Authentication Sessions  */
    /********************************************/
    const resultSession = await VtexHttp.post(AUTH_SESSION(), undefined, {
      params: { scope: process.env.VTEX_SCOPE }
    })
    if (!_.get(resultSession, "data")) throw new Failure({ code: 400, message: "Response session with no content" })

    /********************************************/
    /* Send Vtex Authentication Code to Email        */
    /********************************************/
    const resultSentCode = await VtexHttp.post(SEND_EMAIL_ACCESS_KEY(), undefined, {
      params: {
        "authenticationToken": _.get(resultSession, "data.authenticationToken"),
        "email": email
      }
    })
    if (!_.get(resultSentCode, "data")) throw new Failure({ code: 400, message: "Was not possible to send access key to email" })

    /*********************************************/
    /* Returns Authentication Token to User      */
    /*********************************************/
    return { authenticationToken: resultSession.data.authenticationToken }

  },
  reset: async (login, authenticationToken, newPassword, accessKey) => {
    /********************************************/
    /* Validate input data                     */
    /********************************************/
    const payload = { login, authenticationToken, newPassword, accessKey }
    await Validator(payload, AuthResetValidations, "Invalid input data, review errors below.")

    /*********************************************/
    /* Returns Authentication Token to User      */
    /*********************************************/
    const resultSentCode = await VtexHttp.post(RESET_PASSWORD(), undefined, {
      params: payload
    })
    if (!_.get(resultSentCode, "data")) throw new Failure({ code: 400, message: "Was not possible to reset password" })

    /***********************************************/
    /* Returns success to user if everything is ok */
    /***********************************************/
    return { success: true }

  },
  login: async (email, password) => {

    /********************************************/
    /* Validate login input data                */
    /********************************************/
    const payload = { email: email, password: password }
    await Validator(payload, AuthLoginValidations, "Invalid input data, review errors below.")

    /********************************************/
    /* Initialize Vtex Authentication Session   */
    /********************************************/
    const resultSession = await VtexHttp.post(AUTH_SESSION(), undefined, {
      params: { scope: process.env.VTEX_SCOPE }
    })
    if (!resultSession.data) {
      throw new Failure({
        code: 400,
        message: "Response session with no content"
      })
    }

    /**********************************************/
    /* Execute Vtex Auth Login with User and Pass */
    /**********************************************/
    const auth = await VtexHttp.post(AUTH_VALIDATION(), undefined, {
      params: {
        "login": email,
        "password": password,
        "authenticationToken": resultSession.data.authenticationToken
      }
    })

    /**********************************************/
    /* Verify if Auth Status is Success           */
    /**********************************************/
    if (_.get(auth, "data.authStatus") != "Success") {
      throw new Failure({
        code: 400,
        message: `Response authentication with error code (${_.get(auth, "data.authStatus", "Unknown")})`
      })
    }

    /**********************************************************/
    /* Check if user is alerady attached to customer document */
    /**********************************************************/
    const customerDocument = await VtexHttp.get(SEARCH_USER(_.get(auth, "data.userId")));

    /**********************************************************/
    /* If no customer document is attached, then attach it    */
    /**********************************************************/
    if (_.isEmpty(customerDocument.data)) {
      /**********************************************************/
      /* Attach authenticated userId to customer document by    */
      /* the valid email authenticated                          */
      /**********************************************************/
      await VtexHttp.patch(UPDATE_USER(), {
        email: email,
        userId: String(_.get(auth, "data.userId"))
      });
    }

    /**********************************************************/
    /* Retrieve all user customer document data               */
    /**********************************************************/
    const user = await VtexHttp.get(SEARCH_USER(_.get(auth, "data.userId"), [
      "corporateDocument", "corporateName", "document", "email",
      "firstName", "lastName", "phone", "profilePicture", "isCorporate",
      "birthDate", "documentType", "gender", "id", "userId"
    ]));
    if (!user.data) {
      throw new Failure({
        code: 400,
        message: "Was not possible to find authenticated user data"
      })
    }

    /******************************************/
    /* Return authenticated user data do user */
    /******************************************/
    return {
      authStatus: _.get(auth, "data.authStatus"),
      jwt: _.get(auth, "data.authCookie.Value"),
      expiresIn: _.get(auth, "data.expiresIn"),
      userId: _.get(auth, "data.userId"),
      user: _.get(user, "data")
    }
  },
  loginFacebook: async (token) => {

    /********************************************/
    /* Setup Facebook JDK                       */
    /********************************************/
    FB.options({
      version: 'v8.0',
      appId: process.env.FACEBOOK_APP_KEY,
      appSecret: process.env.FACEBOOK_APP_SECRET
    });
    /********************************************/
    /* Update Facebook Access Token             */
    /********************************************/
    FB.setAccessToken(token);

    /********************************************/
    /* Request Facebook SDK User Data           */
    /********************************************/
    const response = await FB.api('me', { fields: ['id', 'name', 'email'] });

    /********************************************/
    /* Return Facebook UserData response        */
    /********************************************/
    console.log(response)
    return {
      authStatus: "unknown",
      jwt: "unknown",
      expiresIn: 0,
      userId: "unknown",
      user: "unknown"
    }

  },
  loginGoogle: async (token) => {

    /**********************************************************/
    /* Execute POST to Google OAuth Endpoint With AccessToken */
    /**********************************************************/
    const response = await axios.post(`https://accounts.google.com/o/oauth2/token`, {
      body: {
        grant_type: "authorization_code",
        client_id: process.env.GOOGLE_APP_KEY,
        client_secret: process.env.GOOGLE_APP_SECRET,
        redirect_uri: `https://vtexid.vtex.com.br/VtexIdAuthSiteKnockout/ReceiveAuthorizationCode.ashx`,
        code: token,
      }
    })

    /********************************************/
    /* Return Google UserData response          */
    /********************************************/
    console.log(response)
    return {
      authStatus: "unknown",
      jwt: "unknown",
      expiresIn: 0,
      userId: "unknown",
      user: "unknown"
    }

  }
}
