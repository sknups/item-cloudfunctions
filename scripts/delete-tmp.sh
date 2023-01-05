#!/usr/bin/env bash

common_args="--project=drm-apps-01-43b0 --region=europe-west2 --quiet"

gcloud functions delete item-create-non-enumerated-tmp $common_args
gcloud functions delete item-find-tmp $common_args
gcloud functions delete item-get-tmp $common_args
