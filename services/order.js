const util = require("util")
const _ = require("lodash")
const Failure = require("./../utils/Failure")
const VtexHttp = require("./../utils/VtexHttp")
const {
  LIST_ORDERS,
  ORDER_FINDONE,
  SHIPPING_SIMULATION,
  ORDER_PREPARE_PAYMENT,
  ORDER_EXECUTE_PAYMENT,
  ORDER_CREATE
} = require("./../utils/VtexPathMapper")
const Validator = require("./../utils/Validator")
const validatorOrderSimulation = require("./../validators/order_simulation")
const orderCreateValidations = require("./../validators/order_create")

module.exports = {
  find: async (email, page, perPage) => {
    const collections = await VtexHttp.get(LIST_ORDERS(email, page, perPage));
    return _.get(collections, "data", [])
  },
  findone: async (userId, orderId) => {
    const collection = await VtexHttp.get(ORDER_FINDONE(orderId));
    if (userId != _.get(collection, "data.clientProfileData.userProfileId")) {
      throw new Failure({ code: 403, message: "This record dos not belongs to you" })
    }
    return _.get(collection, "data")
  },
  simulation: async (props) => {
    await Validator(props, validatorOrderSimulation, "Invalid body data, review errors below.")
    const response = await VtexHttp.post(SHIPPING_SIMULATION(), props)
    if (!_.get(response, "data")) throw new Failure({ code: 400, message: "Was not possible to process order simulation" })
    return _.get(response, "data")
  },
  payment: async (orderGroup, transactionId, vtexCheckoutAuth, props) => {
    await VtexHttp.post(ORDER_PREPARE_PAYMENT(transactionId), [
      props
    ])
    const responseExecution = await VtexHttp.post(ORDER_EXECUTE_PAYMENT(orderGroup), undefined, {
      header: { 'Cookie': `Vtex_CHKO_Auth=${vtexCheckoutAuth};` }
    })
    return responseExecution
  },
  create: async (props) => {

    const simulation = await strapi.plugins.vtex.services.order.simulation({
      items: _.get(props, "items", []).map(item => ({
        id: _.get(item, "id"),
        quantity: _.get(item, "quantity"),
        seller: _.get(item, "seller", "1")
      })),
      postalCode: String(_.get(props, "address.postalCode")),
      country: "BRA"
    })

    // retrieving selected option from simulation data

    const installmentOption = _.get(simulation, "paymentData.installmentOptions", []).find(option => _.get(option, "paymentSystem") == _.get(props, "paymentSystem"))
    _.set(props, "paymentGroupName", _.get(installmentOption, "paymentGroupName"))
    const shippingMethod = _.get(simulation, "logisticsInfo.0.slas", []).find(sla => _.get(sla, "id") === _.get(props, "shippingMethod"))
    await Validator(props, orderCreateValidations, "Invalid body data, review errors below.")


    const orderPayload = {
      items: simulation.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        seller: item.seller,
        price: item.price,
        isGift: false,
        rewardValue: 0,
        offerings: [],
        priceTags: [],
      })),
      clientProfileData: props.clientProfileData,
      shippingData: {
        "id": "shippingData",
        "address": props.address,
        "logisticsInfo": [{
          "itemIndex": 0,
          "selectedSla": _.get(shippingMethod, "id", "unknown"),
          "selectedDeliveryChannel": _.get(shippingMethod, "deliveryChannel", "unknown"),
          "shippingEstimate": _.get(shippingMethod, "shippingEstimate", "0bd"),
          "price": _.get(shippingMethod, "price", 0),
          "lockTTL": _.get(shippingMethod, "lockTTL", null),
          "deliveryWindow": _.get(shippingMethod, "deliveryWindow", null),
        }]
      },
      paymentData: {
        "id": "paymentData",
        "payments": [{
          paymentSystem: props.paymentSystem,
          referenceValue: _.get(simulation, "totals.0.value") + _.get(shippingMethod, "price", 0),
          value: _.get(simulation, "totals.0.value") + _.get(shippingMethod, "price", 0),
          installments: props.installments,
          currencyCode: "BRL"
        }]
      }
    }

    // generating order
    let response = undefined
    try {
      response = await VtexHttp.put(ORDER_CREATE(), orderPayload);
      if (_.get(response, "status") != 201) throw new Failure({ code: 400, message: "Was not possible to create order" })
    } catch (error) {
      throw new Failure({ code: 400, message: _.get(error, "response.data.orderForm.messages", "Was not possible to create order") })
    }
    const checkoutCookie = _.get(response, "headers.set-cookie", []).find((cookie) => cookie.startsWith("Vtex_CHKO_Auth="))
    if (!checkoutCookie) throw new Failure({ code: 400, message: "Vtex Checkout Cookie was not found" })
    const createdOrder = {
      vtexCheckoutAuth: String(checkoutCookie.split(";").find((key) => key.startsWith("Vtex_CHKO_Auth="))).replace("Vtex_CHKO_Auth=", "").trim(),
      orderId: _.get(response, "data.orders.0.orderId"),
      orderGroup: _.get(response, "data.orders.0.orderGroup"),
      addressId: _.get(response, "data.orders.0.shippingData.address.addressId"),
      transactionId: _.get(response, "data.transactionData.merchantTransactions.0.transactionId"),
      merchantName: _.get(response, "data.transactionData.merchantTransactions.0.merchantName"),
      value: _.get(response, "data.transactionData.merchantTransactions.0.payments.0.value"),
    }

    const paymentPayload = {
      paymentSystem: props.paymentSystem,
      paymentSystemName: _.get(installmentOption, "paymentName", ""),
      group: _.get(installmentOption, "paymentGroupName", ""),
      installments: props.installments,
      installmentsInterestRate: 0,
      installmentsValue: createdOrder.value,
      value: createdOrder.value,
      referenceValue: createdOrder.value,
      fields: {
        addressId: createdOrder.addressId,
      },
      transaction: {
        id: createdOrder.transactionId,
        merchantName: createdOrder.merchantName
      },
      currencyCode: "BRL"
    }
    if (paymentPayload.group === "creditCardPaymentGroup") {
      _.set(paymentPayload, "fields.holderName", _.get(props, "cc.holderName"))
      _.set(paymentPayload, "fields.cardNumber", _.get(props, "cc.cardNumber"))
      _.set(paymentPayload, "fields.validationCode", _.get(props, "cc.validationCode"))
      _.set(paymentPayload, "fields.dueDate", _.get(props, "cc.dueDate"))
    }
    // sending payment request after create order
    await strapi.plugins.vtex.services.order.payment(
      createdOrder.orderGroup,
      createdOrder.transactionId,
      createdOrder.vtexCheckoutAuth,
      paymentPayload
    );

    return createdOrder
  }
}
