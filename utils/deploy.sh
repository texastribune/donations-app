#!/usr/bin/env bash

echo "S3 BUCKET: "${npm_package_config_s3_bucket:?"The S3 bucket needs to be set in the package.json"}

export APP_S3_BUCKET=$npm_package_config_s3_bucket

echo "Syncing *.css files to S3..."
aws s3 sync --acl public-read --include '*.css' --cache-control 'max-age=31536000' build s3://$APP_S3_BUCKET/

echo "Syncing *.js files to S3..."
aws s3 sync --acl public-read --include '*.js' --cache-control 'max-age=31536000' build s3://$APP_S3_BUCKET/

echo "Syncing *.html files to S3..."
aws s3 sync --acl public-read --include '*.html' --cache-control 'max-age=60' build s3://$APP_S3_BUCKET/

echo "Syncing image files to S3..."
aws s3 sync --acl public-read --include '*.jpg' --include '*.png' --include '*.gif' --cache-control 'max-age=604800' build s3://$APP_S3_BUCKET/

echo "Syncing everything else to S3..."
aws s3 sync --profile newsapps build s3://$APP_S3_BUCKET/
