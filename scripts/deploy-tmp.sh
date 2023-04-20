#!/usr/bin/env bash

set -e

common_args="--project drm-apps-01-43b0"
common_args="${common_args} --trigger-http"
common_args="${common_args} --region=europe-west2"
common_args="${common_args} --security-level=secure-always"
common_args="${common_args} --runtime=nodejs18"
common_args="${common_args} --memory=512MB"
common_args="${common_args} --set-env-vars CF_BASE_URL=https://europe-west2-drm-apps-01-43b0.cloudfunctions.net,ASSETS_URL=https://assets-dev.sknups.gg,FLEX_URL=https://flex-dev.sknups.com,SKNAPP_URL=https://app-dev.sknups.com"

npm run build

name=item-create-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=createItem \
    --service-account=item-cf-write@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-create-from-drop-link-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=createItemFromDropLink \
    --service-account=item-cf-write@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-create-from-giveaway-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=createItemFromGiveaway \
    --service-account=item-cf-write@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-create-from-purchase-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=createItemFromPurchase \
    --service-account=item-cf-write@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-find-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=getItems \
    --service-account=item-cf-read@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-get-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=getItem \
    --service-account=item-cf-read@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-update-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=updateItem \
    --service-account=item-cf-read@drm-apps-01-43b0.iam.gserviceaccount.com
fi

name=item-find-last-issued-tmp
if [[ -z "$1" || "$1" == "$name" ]]; then
  gcloud functions deploy $name \
    $common_args \
    --entry-point=findLastIssued \
    --service-account=item-cf-read@drm-apps-01-43b0.iam.gserviceaccount.com
fi
