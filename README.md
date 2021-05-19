# strapi-plugin-vtex

## 🚀 &nbsp; _Overview_

This plugin implements a complete purchase flow using the VTEX API, just install it and configure the environment variables to make the resources available for your front-end to consume.

---

## ⏳ &nbsp; _Installation_

With npm:
```bash
npm install strapi-plugin-vtex
```

With yarn:
```bash
yarn add strapi-plugin-vtex
```

---
## 📦 _Configuration_

This plugin needs some environment variables to work, its variables is decribed on `.env.example` file but i going to describe it below too.

In particular, I prefer to configure and use plugin variables directly from the `procces.env` command instead of configuring them in the `config/plugins.js` file of the strapi project. I do not find it interesting to configure plugins outside the context of the plugin.

So the only thing you need to do is describe this environment variables on your `.env` file for `development` environment and setup the same variables on your server for `production` environment.

```env
VTEX_API_PREFIX=vtex
VTEX_SCOPE=<yours-vtex-store-scope>
VTEX_API_KEY=<yours-vtex-api-key>
VTEX_API_SECRET=<yours-vtex-api-secret>
VTEX_TRADE_POLICY=<yours-vtex-trade-policy>
FACEBOOK_APP_KEY=<yours-facebook-app-key>
FACEBOOK_APP_SECRET=<yours-facebook-app-secret>
GOOGLE_APP_KEY=<yours-google-app-key>
GOOGLE_APP_SECRET=<yours-google-app-secret>
```

### Describing each variable:

`VTEX_API_PREFIX:` By default this plugin forces `no prefix` for url api resources, but you can define one to segment your api like `vtex` so your resources will look like **`(GET /vtex/me)`**.

`VTEX_SCOPE:` Is your vtex subdomain commerce scope, it is used to identify your store on VTEX API PLATFORM.

`VTEX_API_KEY:` Is the generated API KEY used to get access to VTEX API PLATFORM.
<br/>[(See this link tutorial to generate your access keys)](vtex-credentials)

`VTEX_API_SECRET:` Is the generated API SECRET used to get access to VTEX API PLATFORM.
<br/>[(See this link tutorial to generate your access keys)](vtex-credentials)

`VTEX_TRADE_POLICY:` Is the configured trade policy in your VTEX PANEL to access your products and trade policies trought this plugin integration.

`FACEBOOK_APP_KEY:` Is the generated facebook app key configured in yours VTEX PANEL to able social login with facebook.


`FACEBOOK_APP_SECRET:` Is the generated facebook app secret configured in yours VTEX PANEL to able social login with facebook.


`GOOGLE_APP_KEY:` Is the generated google app key configured in yours VTEX PANEL to able social login with google.

`GOOGLE_APP_SECRET:` Is the generated google app secret configured in yours VTEX PANEL to able social login with google.

---
## ✨ &nbsp; _API Resources_

**`POST /auth/register`**
<br/>_Create a customer account on VTEX PLATFORM_ `[public]`
```json
{
	"email": "john.doe@gmail.com",
	"firstName": "John",
	"lastName": "Doe",
	"document": "11111111191",
	"phone": "+551199999999",
	"isNewsletterOptIn": true|false
}
```

**`POST /auth/request_reset`**
<br/>_Request a reset password to desired vtex account email_ `[public]`
```json
{
    "email": "john.doe@gmail.com"
}
```

**`POST /auth/reset`**
<br/>_Reset password for desired vtex account email_ `[public]`
```json
{
    "email": "john.doe@gmail.com",
    "authenticationToken": "F2D9E877E061A7C2AF70990B54EEC408829B523F9E094C8B4BB1018CB9C0AA38",
    "newPassword": "super-secret-password",
    "accessKey": "123456"
}
```

**`POST /auth/login`**
<br/>_Execute the classic login (username & password) for VTEX customer account_ `[public]`
```json
{
    "email": "john.doe@gmail.com",
    "password": "super-secret-password"
}
```

**`POST /me`**
<br/>_Update authenticated VTEX customer account_
`[protected by jwt token]`
```json
{
    "email": "john.doe@gmail.com",
    "password": "super-secret-password"
}
```

**`GET /me`**
<br/>_Get authenticated VTEX customer account data_
`[protected by jwt token]`

**`GET /me/addresses`**
<br/> _Get authenticated VTEX customer address data_
`[protected by jwt token]`

**`GET /me/addresses/:id`**
<br/>_Fin one authenticated VTEX customer address_
`[protected by jwt token]`


**`POST /me/addresses`**
<br/>_Create authenticated VTEX customer address_
`[protected by jwt token]`
```json
{
    "addressName": "home",
    "addressType": "residential",
    "receiverName": "JOHN DOE",
    "postalCode": "943062700",
    "street": "Solana Dr",
    "number": "404",
    "complement": "B",
    "neighborhood": "Barron Park",
    "city": "Palo Alto",
    "state": "CA",
    "country": "USA",
    "geoCoordinate": [0, 0],
    "reference": null
}
```

**`PUT /me/addresses/:id`**
<br/>_Update authenticated VTEX customer address_
`[protected by jwt token]`
```json
{
    "addressName": "newhome",
    "addressType": "residential",
    "receiverName": "JOHN DOE",
    "postalCode": "943062700",
    "street": "Solana Dr",
    "number": "404",
    "complement": "B",
    "neighborhood": "Barron Park",
    "city": "Palo Alto",
    "state": "CA",
    "country": "USA",
    "geoCoordinate": [0, 0],
    "reference": null,
    "reference": "close to school"
}
```

**`DELETE /me/addresses/:id`**
<br/>_Delete an authenticated VTEX customer address_
`[protected by jwt token]`

**`GET /categories/level/:level`**
<br/>_Retrieve all categories from VTEX PLATFORM with cascade levels_
`[public]`

**`GET /stores`**
<br/>_Retrieve all registeres physic stores from VTEX PLATFORM_
`[public]`

**`GET /collections`**
<br/>_Retrieve all collections from VTEX PLATFORM_
`[public]`

**`GET /collections/:id/products`**
<br/>_Retrieve products from VTEX PLATFORM for a specific collection_
`[public]`

**`GET /products/autocomplete?searchTerm=Cellphone`**
<br/>_Retrieve product suggestions from VTEX PLATFORM for input searchTerm_
`[public]`

**`GET /products`**
<br/>_Retrieve a list of products from VTEX PLATFORM_
`[public]`

**`GET /orders`**
<br/>_Retrieve a list of orders from VTEX PLATFORM authenticated customer_
`[protected by jwt token]`

**`GET /orders/:id`**
<br/>_Retrieve a specific order from VTEX PLATFORM authenticated customer_
`[protected by jwt token]`

**`POST /orders/simulation`**
<br/>_Simulate an order on VTEX PLATFORM to preview available subtotal, taxes, payment conditions and shipping methods_
`[public]`

```json
{
	"items":[{
		"id":"12345",
		"quantity": 1,
		"seller": "1"
	}],
	"postalCode": "943062700",
	"country": "USA"
}

```
**`POST /orders`**
<br/>_Generate an order on VTEX PLATFORM to specified `clientProfileData.email`, if user does not has an account yet, it will be generated for specified email, than you will be able to reset the password over the `POST /auth/request_reset` resource._
`[public]`

```json
{
	"items":[{
		"id":"12345",
		"quantity": 1,
		"seller": "1"
	}],
	"paymentSystem": 6,
	"installments": 1,
	"shippingMethod": "Fedex",
	"clientProfileData": {
		"email": "john.doe@gmail.com",
        "firstName": "John",
        "lastName": "Doe",
        "document": "11111111191",
        "phone": "+551199999999",
        "isNewsletterOptIn": true|false
	},
	"cc": {
		"holderName": "JOHN DOE",
        "cardNumber": "4111111111111111",
		"dueDate": "09/24",
		"validationCode": "123"
	},
	"address":{
		"addressName": "home",
        "addressType": "residential",
        "receiverName": "JOHN DOE",
        "postalCode": "943062700",
        "street": "Solana Dr",
        "number": "404",
        "complement": "B",
        "neighborhood": "Barron Park",
        "city": "Palo Alto",
        "state": "CA",
        "country": "USA",
        "geoCoordinate": [0, 0],
        "reference": null
	}
}
```

**`GET /locations/cep/:cep`**
<br/>_Retrieve address suggestion for specified zipcode_
`[brazil only]` `[public]`

**`GET /locations/estados`**
<br/>_Retrieve a list of states in brazil_
`[brazil only]` `[public]`

**`GET /locations/estados/:uf/municipios`**
<br/>_Retrieve a list of cities for specified state in brazil_
`[brazil only]` `[public]`

**`GET /locations/municipios/:city/bairros`**
<br/>_Retrieve a list of neighborhoos for specified city in brazil_
`[brazil only]` `[public]`

---

## 🎉 &nbsp;  _Congradulations, You're done._

I hope this documentation is clear and helps you understand how to configure yours VTEX API on strapi.

---

## 📜 &nbsp; _License_

This project is under the MIT license. See the [LICENSE](./LICENSE) for details.

💻 &nbsp; Developed by André Ciornavei - [Get in touch!](linkedin)

[linkedin]: https://www.linkedin.com/in/andreciornavei/
[vtex-credentials]: https://developers.vtex.com/vtex-rest-api/docs/getting-started-authentication