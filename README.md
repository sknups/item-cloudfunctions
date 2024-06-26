# item-cloudfunctions
Cloud functions related to items

## No License

This repository and its contents, including but not limited to code, documentation, and any associated files, are the property of Upskins Ltd and are not licensed for any use, modification, distribution, or reproduction. Upskins Ltd reserves all rights to the materials contained herein.

Unauthorized use, reproduction, distribution, or modification of any part of this repository may violate the intellectual property rights of Upskins Ltd and may be subject to legal action.

## Local development

To execute locally, you will need:

* nvm
* Nodejs 18.x
* npm 9.x
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
FLEX_URL=https://flex-dev.sknups.com
LOG_FORMAT=simple
SKNAPP_URL=https://app-dev.sknups.com
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

### item-find-last-issued

```bash
BASE_URL=http://localhost:8080
SKU_CODE=TEST-DODECAHEDRON-BLUE

curl -H 'content-type: application/json' $BASE_URL/item-find-last-issued/SKN/$SKU_CODE 
```

### item-count

```bash
BASE_URL=http://localhost:8080
SKU_CODE=TEST-DODECAHEDRON-GIVEAWAY

curl -H 'content-type: application/json' $BASE_URL/item-count/SKN/$SKU_CODE 
```

### item-create-from-drop-link (enumerated)

```bash
BASE_URL=http://localhost:8080
SKU_CODE=TEST-DODECAHEDRON-BLUE
USER=devtesting

curl \
  -H 'Content-Type: application/json' \
  $BASE_URL/item-create-from-drop-link \
  -d '{"sku":"'$SKU_CODE'","user":"'$USER'","giveaway":"devtest-fake"}'
```

### item-create-from-giveaway

```bash
BASE_URL=http://localhost:8080
SKU_CODE=TEST-DODECAHEDRON-GIVEAWAY
USER=devtesting

curl \
  -H 'Content-Type: application/json' \
  $BASE_URL/item-create-from-giveaway \
  -d '{"sku":"'$SKU_CODE'","user":"'$USER'"}'
```

### item-create-from-purchase

```bash
BASE_URL=http://localhost:8080
SKU_CODE=TEST-DODECAHEDRON-BLUE
USER=devtesting

curl \
  -H 'Content-Type: application/json' \
  $BASE_URL/item-create-from-purchase \
  -d '{"sku":"'$SKU_CODE'","user":"'$USER'","transaction":"devtest-fake"}'
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
