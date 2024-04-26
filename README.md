# Node PSPark SDK usage

You should have jwt-key and api-key keys to be able to use our API via this SDK. jwt-key is a CSR file.

## Generating a CSR file

A Certificate Signing Request (.csr) file is required to authenticate an API user and to get your API-Key. The .csr file contains your API public key that will be used to validate the request signature. To generate your RSA 4096 private key (stored in pspakr_secret.key) for signing requests, use the following command line:

```
openssl req -new -newkey rsa:4096 -nodes -keyout pspakr_secret.key -out pspark_public_key.csr
```

Make sure you keep the API secret key (**pspark_secret.key**) safe and secure. Do not share your API secret key with anyone. To get your API-key you should upload your pspark_public_key in the [cabinet.pspark.io](https://cabinet.pspark.io).

## Installation

`npm i @pspark/sdk-node`

## Request examples

Bellow shown a simple example of SDK usage.

```js
import { PSPark } from '@pspark/sdk-node';

const client = new PSPark(jwtKey, apiKey);

const balances = await client.getBalances();
```

## Validation errors

The API doesn't implement all RESTFull API requirements and has its own response structure.

All HTTP responses from the server will have 200 status code. So, if your request will have some validation errors, the code, and it's description will be presented in the response body as shown bellow.

Response Example

```json
{
  "code": 1002,
  "message": "error description",
  "data": {
    //... some data
  }
}
```

Each time when the server's response will have some validation errors, the SDK will throw `ResponseValidationError`.
