module.exports = {
  USER_PROFILE: ({ email }) => `/api/checkout/pub/profiles?email=${email}`,
  COMPANY_CREATE: () => `/api/dataentities/BU/documents`,
  CUSTOMER_CREATION: () => `/api/dataentities/CL/documents`,
  SEND_EMAIL_ACCESS_KEY: () => `/api/vtexid/pub/authentication/accesskey/send`,
  RESET_PASSWORD: () => `/api/vtexid/pub/authentication/classic/setpassword`,
  AUTH_SESSION: () => `/api/vtexid/pub/authentication/start`,
  AUTH_VALIDATION: () => `/api/vtexid/pub/authentication/classic/validate`,
  UPDATE_USER: () => `/api/dataentities/CL/documents`,
  SEARCH_USER: (userId, fields = ["id"]) => `/api/dataentities/CL/search?userId=${userId}&_fields=${fields.join(",")}`,
  WISHLIST_FIND: (userId) => `/api/dataentities/WS/search?userId=${userId}&_fields=id,userId,productsList`,
  WISHLIST_UPDATE: (id) => `/api/dataentities/WS/documents/${id}`,
  SEARCH_ADDRESSESS: (userId) => `/api/dataentities/AD/search?userId=${userId}&_fields=addressName,addressType,city,complement,country,geoCoordinate,neighborhood,number,postalCode,receiverName,reference,state,street,id,userId`,
  ADDRESS_FINDONE: (addressId) => `/api/dataentities/AD/search?id=${addressId}&_fields=addressName,addressType,city,complement,country,geoCoordinate,neighborhood,number,postalCode,receiverName,reference,state,street,id,userId`,
  ADDRESS_DELETE: (addressId) => `/api/dataentities/AD/documents/${addressId}`,
  ADDRESS_CREATE: () => `/api/dataentities/AD/documents`,
  ADDRESS_PATCH: (addressId) => `/api/dataentities/AD/documents/${addressId}`,
  ORDER_FINDONE: (orderId) => `/api/oms/pvt/orders/${orderId}`,
  LIST_ORDERS: (userSubEmail, page, perPage) => `/api/oms/pvt/orders?q=${userSubEmail}&page=${page || 1}&per_page=${perPage || 15}&orderBy=creationDate,desc&timestamp=${Date.now()}`,
  LIST_CATEGORIES: (level) => `/api/catalog_system/pub/category/tree/${level}`,
  LIST_STORES: () => `/api/dataentities/LJ/search?_fields=Area,CEP,Cidade,Codigo,Endereco,Estado,Funcionamento,Latitude,Local,Longetude,Nome,Numero,id`,
  AUTOCOMPLETE_PRODUCTS: (searchTerm) => `/buscaautocomplete?productNameContains=${searchTerm}`,
  PRODUCT_FINDONE: (productId) => `/api/catalog/pvt/product/${productId}`,
  PRODUCT_VARIATIONS: (productId) => `/api/catalog_system/pub/products/variations/${productId}`,
  SKU_FINDONE: (skuId) => `/api/catalog/pvt/stockkeepingunit/${skuId}`,
  SHIPPING_SIMULATION: () => `/api/checkout/pub/orderForms/simulation?sc=${process.env.VTEX_TRADE_POLICY}`,
  ORDER_CREATE: () => `/api/checkout/pub/orders?sc=${process.env.VTEX_TRADE_POLICY}`,
  ORDER_PREPARE_PAYMENT: (transactionId) => `https://${process.env.VTEX_SCOPE}.vtexpayments.com.br/api/pub/transactions/${transactionId}/payments`,
  ORDER_EXECUTE_PAYMENT: (orderGroup) => `/api/checkout/pub/gatewayCallback/${orderGroup}`,
  COLLECTION_FIND: ({ page, perPage }) => `/api/catalog_system/pvt/collection/search?page=${page || 1}&pageSize=${perPage || 15}`,
  COLLECTION_PRODUCTS_FIND: ({ collectionId, page, perPage }) => `/api/catalog/pvt/collection/${collectionId}/products?page=${page || 1}&pageSize=${perPage || 10}&Active=true&Visible=true&SalesChannelId=${process.env.VTEX_TRADE_POLICY}`,
  SEARCH_PRODUCTS: ({
    searchTerm, filterBy, filterValue,
    filterValueTo, orderBy, orderType, page, perPage
  }) => {
    const filters = [
      `fq=isAvailablePerSalesChannel_${process.env.VTEX_TRADE_POLICY}:1`
    ]
    if (searchTerm) {
      filters.push(`ft=${searchTerm}`)
    }
    if (filterBy && filterValue) {
      switch (filterBy) {
        case 'category':
          filters.push(`fq=C:${filterValue}`)
          break
        case 'collection':
          filters.push(`fq=productClusterIds:${filterValue}`)
          break
        case 'ean13':
          filters.push(`fq=alternateIds_Ean:${filterValue}`)
          break
        case 'price_range':
          filters.push(`fq=P:[${filterValue} TO {${filterValueTo}}]`)
          break
        case 'product':
          filters.push(`fq=productId:${filterValue}`)
          break
        case 'sku':
          filters.push(`fq=skuId:${filterValue}`)
          break
        case 'reference':
          filters.push(`fq=alternateIds_RefId:${filterValue}`)
          break
        case 'seller':
          filters.push(`fq=sellerId:${filterValue}`)
          break
      }
    }
    if (orderBy && orderType) {
      const ordering = { "asc": "ASC", "desc": "DESC" }
      switch (orderBy) {
        case 'name':
          filters.push(`O=OrderByName${ordering[orderType]}`)
          break
        case 'price':
          filters.push(`O=OrderByPrice${ordering[orderType]}`)
          break
        case 'best_discount':
          filters.push(`O=OrderByBestDiscountDESC`)
          break
        case 'release_date':
          filters.push(`O=OrderByReleaseDateDESC`)
          break
        case 'review_rate':
          filters.push(`O=OrderByReviewRateDESC`)
          break
        case 'score':
          filters.push(`O=OrderByScoreDESC`)
          break
        case 'top_sale':
          filters.push(`O=OrderByTopSaleDESC`)
          break
      }
    }
    if (page && perPage) {
      const p = (page < 1 ? 1 : page) - 1
      const pp = perPage > 50 ? 50 : perPage < 1 ? 1 : perPage
      filters.push(`_from=${p * pp}`)
      filters.push(`_to=${(p * pp) + (pp - 1)}`)
    }
    return `/api/catalog_system/pub/products/search?${filters.join("&")}`
  }
}
