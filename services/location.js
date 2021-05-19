const _ = require("lodash")
const axios = require("axios");
const ViacepHttp = require("../utils/ViacepHttp");
const LocaleStateEntity = require("../entities/locale-state-entity");
const LocaleCityEntity = require("../entities/locale-city-entity");
const LocaleDistrictEntity = require("../entities/locale-district-entity");

module.exports = {
  cep: async (cep) => {
    return await ViacepHttp(cep);
  },
  states: async () => {
    const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`);
    return _.get(response, "data", []).map(item => new LocaleStateEntity(item)) || []
  },
  cities: async (state) => {
    const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
    return _.get(response, "data", []).map(item => new LocaleCityEntity(item)) || []
  },
  districts: async (city) => {
    const response = await axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios/${city}/distritos`);
    return _.get(response, "data", []).map(item => new LocaleDistrictEntity(item)) || []
  }
}
