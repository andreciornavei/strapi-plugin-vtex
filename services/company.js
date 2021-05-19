const _ = require("lodash")
const Failure = require("../utils/Failure");
const VtexHttp = require("../utils/VtexHttp");
const { COMPANY_CREATE } = require("../utils/VtexPathMapper");
const Validator = require("./../utils/Validator")
const CompanyCreateValidations = require("./../validators/company_create")
module.exports = {
  create: async (data) => {
    await Validator(data, CompanyCreateValidations, "Invalid input data, review errors below.")
    const response = await VtexHttp.post(COMPANY_CREATE(), {
      name: data.name,
      empresa: data.empresa,
      email: data.email,
      phone: data.phone,
      description: data.description,
    });
    if (!response.data) throw new Failure({
      code: 400,
      message: "Was not possible to create the company"
    })
    return {
      ...data,
      id: _.get(response, "data.DocumentId")
    }
  }
}
