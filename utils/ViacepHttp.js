const _ = require("lodash")
const axios = require("axios")

module.exports = async (cep) => {
  try {
    const addresses = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
    return addresses.data
  } catch (error) {
    return {
      description: "Was not possible to execute find on CEP Provider",
      errorMessage: _.get(error, "response.message", error.message),
      original: error
    };
  }
}
