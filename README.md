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
CF_BASE_URL=https://europe-west2-drm-apps-01-43b0.cloudfunctions.net
EMAIL_HASHING_SECRET='#oBbMZrt56ti'
FLEX_URL=https://flex-dev.sknups.com
LOG_FORMAT=simple
SKNAPP_URL=https://app-dev.sknups.com
ASSETS_URL=https://assets-dev.sknups.gg
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
```

## Functions

### item-get

Get by ownership token:

```bash
BASE_URL=http://localhost:8080
OWNERSHIP_TOKEN=00cb1c5b57

curl $BASE_URL/item-get/SKN/$OWNERSHIP_TOKEN
```

Get by nft address:

```bash
BASE_URL=http://localhost:8080
NFT_ADDRESS=SOL.devnet.5KNMdb2sV1pm5fK28cH499fz32XJDFWxR69QFnR9fc2u

curl $BASE_URL/item-get/SKN/nft.$NFT_ADDRESS
```


### item-find

```bash
BASE_URL=http://localhost:8080
BLOCKCHAIN_ADDRESS=SOL.devnet.A3khazraukupQqGctyxg27tvPdaKYTvtjcE4tMBUW7D8
USER=3DtShGmxzyPJwCJEzLPM7RlmOt73

curl $BASE_URL/item-find -H 'content-type: application/json' \
  -d '{"platformCode":"SKN","blockchainAddress":"'$BLOCKCHAIN_ADDRESS'","user":"'$USER'"}'
```

### item-create (non-enumerated)

```bash
BASE_URL=http://localhost:8080
SKU_CODE=TEST-DODECAHEDRON-GIVEAWAY
CLAIM_CODE=test
EMAIL=devtesting@sknups.com
USER=devtesting

curl \
  -H 'Content-Type: application/json' \
  $BASE_URL/item-create \
  -d '{"skuCode":"'$SKU_CODE'","claimCode":"'$CLAIM_CODE'","email":"'$EMAIL'","user":"'$USER'"}'
```

### item-create (enumerated)

```bash
BASE_URL=http://localhost:8080
SKU_CODE=TEST-DODECAHEDRON-BLUE
EMAIL=devtesting@sknups.com
USER=devtesting

curl \
  -H 'Content-Type: application/json' \
  $BASE_URL/item-create \
  -d '{"skuCode":"'$SKU_CODE'","email":"'$EMAIL'","user":"'$USER'"}'
```

### item-update

MINTING:

```bash
ITEM_CODE=abc12def34
BASE_URL=http://localhost:8080
NFT_ADDRESS=SOL.devnet.$(date +%s)

curl \
  $BASE_URL/item-update/SKN/$ITEM_CODE \
  -H 'Content-Type: application/json' \
  -d '{"operation":"MINTING","nftAddress":"'$NFT_ADDRESS'","ownerAddress":"SOL.devnet.owner1"}'
```

MINT_FAILED:

```bash
BASE_URL=http://localhost:8080
ITEM_CODE=abc12def34

curl \
  $BASE_URL/item-update/SKN/$ITEM_CODE \
  -H 'Content-Type: application/json' \
  -d '{"operation":"MINT_FAILED"}'
```

MINTED:

```bash
ITEM_CODE=abc12def34
BASE_URL=http://localhost:8080

curl \
  $BASE_URL/item-update/SKN/$ITEM_CODE \
  -H 'Content-Type: application/json' \
  -d '{"operation":"MINTED"}'
```

OWNER_ADDRESS:

```bash
BASE_URL=http://localhost:8080
NFT_ADDRESS=SOL.devnet.123456

curl \
  $BASE_URL/item-update/SKN/nft.$NFT_ADDRESS \
  -H 'Content-Type: application/json' \
  -d '{"operation":"OWNER_ADDRESS","ownerAddress":"SOL.devnet.dummy3"}'
```

## Test GCP Deployment

Deploy functions with `-tmp` suffix:

```bash
npm run deploy
```

Delete functions with `-tmp` suffix:

```bash
npm run delete
```
