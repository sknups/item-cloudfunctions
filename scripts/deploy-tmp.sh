#!/usr/bin/env bash

common_args="--project drm-apps-01-43b0"
common_args="${common_args} --trigger-http"
common_args="${common_args} --region=europe-west2"
common_args="${common_args} --security-level=secure-always"
common_args="${common_args} --runtime=nodejs16"
common_args="${common_args} --set-env-vars CF_BASE_URL=https://europe-west2-drm-apps-01-43b0.cloudfunctions.net,ASSETS_URL=https://assets-dev.sknups.gg,FLEX_URL=https://flex-dev.sknups.com,SKNAPP_URL=https://app-dev.sknups.com"
common_args="${common_args} --set-secrets EMAIL_HASHING_SECRET=EMAIL_SALT_SEED:latest"

npm run build

name=item-create-non-enumerated-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=createNonEnumeratedItem \
    --memory=512MB \
    --service-account=item-cf-write@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-create-enumerated-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=createEnumeratedItem \
    --memory=512MB \
    --service-account=item-cf-write@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-find-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=getItems \
    --memory=128MB \
    --service-account=item-cf-read@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-get-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=getItem \
    --memory=128MB \
    --service-account=item-cf-read@drm-apps-01-43b0.iam.gserviceaccount.com
fi
