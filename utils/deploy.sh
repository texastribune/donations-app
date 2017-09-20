#!/usr/bin/env bash

yarn run build

echo "Syncing *.css files to S3..."
aws s3 sync --acl public-read --delete --include '*.css' --cache-control 'max-age=31536000' build s3://$APP_S3_BUCKET/

echo "Syncing *.js files to S3..."
aws s3 sync --acl public-read --delete --include '*.js' --cache-control 'max-age=31536000' build s3://$APP_S3_BUCKET/

echo "Syncing *.html files to S3..."
aws s3 sync --acl public-read --delete --include '*.html' --cache-control 'max-age=60' build s3://$APP_S3_BUCKET/

echo "Syncing image files to S3..."
aws s3 sync --acl public-read --delete --include '*.jpg' --include '*.png' --include '*.gif' --cache-control 'max-age=604800' build s3://$APP_S3_BUCKET/

echo "Syncing everything else to S3..."
aws s3 sync build s3://$APP_S3_BUCKET/
