#!/usr/bin/env bash

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

echo "Busting Facebook Open Graph cache..."
for URL in 'index' 'levels' 'faq' 'circle' 'campaign'
do
  echo "Busting $URL.html..."
  curl -d "id=https://support.texastribune.org/$URL.html&scrape=true&access_token=$FB_ACCESS_TOKEN" -X POST https://graph.facebook.com
  printf "\n\n"
  sleep 1
done
