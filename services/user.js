const _ = require("lodash")
const VtexHttp = require("./../utils/VtexHttp")
const Failure = require("../utils/Failure")

const { SEARCH_USER, UPDATE_USER, USER_PROFILE } = require("./../utils/VtexPathMapper")

module.exports = {
  findone: async (userId) => {
    const response = await VtexHttp.get(SEARCH_USER(userId, [
      "corporateDocument", "corporateName", "document", "email",
      "firstName", "lastName", "phone", "profilePicture", "isCorporate",
      "birthDate", "documentType", "gender", "id", "userId"
    ]));
    if (!response.data) {
      throw new Failure({
        code: 400,
        message: "Was not possible to find authenticated user data"
      })
    }
    return _.get(response, "data.0", {});
  },

  update: async ({
    id, email, firstName, lastName, corporateDocument,
    corporateName, document, phone, profilePicture,
    isCorporate, birthDate, documentType, gender
  }) => {
    await VtexHttp.patch(UPDATE_USER(), {
      email: email,
      firstName: firstName,
      lastName: lastName,
      corporateDocument: corporateDocument,
      corporateName: corporateName,
      document: document,
      phone: phone,
      profilePicture: profilePicture,
      isCorporate: isCorporate,
      birthDate: birthDate,
      documentType: documentType,
      gender: gender,
    });
    const user = await VtexHttp.get(SEARCH_USER(String(id), [
      "corporateDocument", "corporateName", "document", "email", "firstName", "lastName",
      "phone", "profilePicture", "isCorporate", "birthDate", "documentType", "gender", "id"
    ]));
    if (!user.data) throw new Failure({
      code: 400,
      message: "Was not possible to find update user"
    })
    return _.get(user, "data", [])
  },

  profile: async (email) => {
    const response = await VtexHttp.get(USER_PROFILE(email));
    if (!response.data) {
      throw new Failure({
        code: 400,
        message: "Was not possible to find authenticated user profile"
      })
    }
    return _.get(response, "data", {});
  },
}
