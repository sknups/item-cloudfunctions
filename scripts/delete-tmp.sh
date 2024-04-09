#!/usr/bin/env bash

common_args="--project=drm-apps-01-43b0 --region=europe-west2 --quiet"

gcloud functions delete item-find-tmp "$common_args"
gcloud functions delete item-get-tmp "$common_args"
gcloud functions delete item-update-tmp "$common_args"
gcloud functions delete item-find-last-issued-tmp "$common_args"
gcloud functions delete item-create-from-drop-link-tmp "$common_args"
gcloud functions delete item-create-from-giveaway-tmp "$common_args"
gcloud functions delete item-create-from-purchase-tmp "$common_args"
