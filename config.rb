configure :development do
  activate :livereload
end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

configure :production do
  activate :asset_hash
  activate :minify_html
end

activate :gzip

activate :s3_sync do |config|
  config.bucket = 'support.texastribune.org'
  config.region = 'us-east-1'
  config.aws_access_key_id = ENV['AWS_ACCESS_KEY']
  config.aws_secret_access_key = ENV['AWS_ACCESS_SECRET']
end

# https://rossta.net/blog/using-webpack-with-middleman.html
activate :external_pipeline,
  name: :webpack,
  command: build? ?
  "./node_modules/webpack/bin/webpack.js --bail -p" :
  "./node_modules/webpack/bin/webpack.js --colors --watch -p",
  source: ".tmp",
  latency: 1

default_caching_policy max_age:(60 * 60 * 24 * 365)
