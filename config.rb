configure :development do
  activate :livereload, host: '0.0.0.0'
end

set :css_dir, 'stylesheets'

set :js_dir, 'javascripts'

set :images_dir, 'images'

configure :production do
  activate :asset_hash
  activate :minify_html
end

activate :gzip

# https://rossta.net/blog/using-webpack-with-middleman.html
activate :external_pipeline,
  name: :webpack,
  command: build? ?
  "./node_modules/webpack/bin/webpack.js --bail" :
  "./node_modules/webpack/bin/webpack.js --watch",
  source: ".tmp",
  latency: 1
