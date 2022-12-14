# item-cloudfunctions
Cloud functions related to items

## Local development

To execute locally, you will need:

* nvm
* Nodejs 16.x
* npm 8.x
* Google Cloud CLI
  * Install (https://cloud.google.com/sdk/docs/install-sdk)
  * Authorization to access the development project 

### Install Dependencies

```bash
npm ci
```

### Set env file

Create a `.env` file for dev, eg:

```bash
cat <<EOF > .env
GCLOUD_PROJECT=drm-apps-01-43b0
EMAIL_HASHING_SECRET='#oBbMZrt56ti'
FLEX_URL=https://flex-dev.sknups.gg
LOG_FORMAT=simple
SKNAPP_URL=https://app-dev.sknups.gg
ASSETS_HOST=https://assets-dev.sknups.gg
FLEX_HOST=https://flex-dev.sknups.gg
SKNAPP_HOST=https://app-dev.sknups.gg
EOF
```

### Development Server

The following command will start a local development server. The server will reload when source files are changed.

```
npm start
```

The cloud functions can now be accessed locally at `http://localhost:8080/item-<function>`.

### Unit Testing

The unit tests can be run using the following command.

```bash
npm test
npm run test:mocha
```

For historic reasons some tests are in jest while others are in mocha. They will be merged at some point.

## Functions

### item-get

```bash
baseUrl=http://localhost:8080
itemCode=00cb1c5b57

curl $baseUrl/item-get/SKN/$itemCode
```

### item-find

```bash
baseUrl=http://localhost:8080
blockchainAddress=SOL.devnet.A3khazraukupQqGctyxg27tvPdaKYTvtjcE4tMBUW7D8
user=3DtShGmxzyPJwCJEzLPM7RlmOt73

curl $baseUrl/item-find -H 'content-type: application/json' \
  -d '{"platformCode":"SKN","blockchainAddress":"'$blockchainAddress'","user":"'$user'"}'
```

### item-create-non-enumerated

```bash
baseUrl=http://localhost:8080
skuCode=TEST-DODECAHEDRON-GIVEAWAY
claimCode=test
email=devtesting@sknups.com
user=devtesting

curl \
  -H 'Content-Type: application/json' \
  http://localhost:8080/item-create-non-enumerated \
  -d '{"skuCode":"'$skuCode'","claimCode":"'$claimCode'","email":"'$email'","user":"'$user'"}'
```
