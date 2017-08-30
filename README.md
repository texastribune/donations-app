## Getting Started
### Basic setup
1. Clone down the project repo
2. Install [rbenv](https://github.com/sstephenson/rbenv) on your machine via Homebrew:
```
brew update
brew install rbenv
rbenv init
```
3. `cd` inside the project directory
4. Download Ruby 2.3.0, the version used in this project: `rbenv install 2.3.0`
5. Switch to that version: `rbenv local 2.3.0`
6. Make sure [Bundler](http://bundler.io/) is installed on your machine: `gem install bundler`
7. Install project packages: `bundle install`
8. Install JS packages: `npm install`

### Node.js
Consult the `engines` section of `package.json` for the Node and NPM versions used in this project. Node is only used for development tools (i.e. Webpack), so any relatively up-to-date version of Node/NPM will probably suffice. Still, it's good to match the exact versions if possible.

The easiest way to use the proper Node version is to use [Node Version Manager](https://github.com/creationix/nvm) (nvm).

To use the proper NPM version, simply install it on your machine: `npm install -g npm@<version>`.


## Structure
### `raw/`
Contains files that will eventually be compiled or otherwise transformed with Webpack.

+ `raw/js`: Place all ES2015 modules and Webpack entry points here.
+ `raw/bg`: Place all background images here. That's because SCSS files `require()` them and will therefore be part of the Webpack build process.
+ `raw/scss`: Place all SCSS files -- partials and entry points -- here.

### `source/`
Contains files that Middleman will eventually minify and move to the `build/` directory.

+ `source/img`: Contains all images **except** background images.
+ `source/layouts`: Contains base ERB templates.
+ `source/bg`: A `.gitignore`d directory containing Webpack-processed background images
+ `source/css`: A `.gitignore`d directory containing Webpack-processed CSS.
+ `source/javascripts`: A `.gitignore`d directory containing Webpack-processed JavaScript.

### `utils/`
+ `deploy.sh`: A shell script for deployment to S3.
+ `critical.js`: A Node script for inlining critical CSS.

### `data/`
Contains YAML files, the data of which is fed into some ERB templates.

### `.babelrc`
Tells Babel how to compile our JavaScript.

### `browserslist`
Tells Autoprefixer what browsers we care about.

### `postcss.config.js`
Tells Webpack what PostCSS stuff we want it to do.

### `webpack.config.js`
The configuration for a modern-browser Webpack build. More on this later.


## Commands
+ `npm run dev`: Fire up the development server. This will enable live reloading of templates, JavaScript and CSS.
+ `npm run build`: Build for production.
+ `npm run middleman`: Do the official Middleman build process.
+ `npm run critical`: Inline critical CSS.


## Deploying
1. Set up your `~/.aws/config` like this:
```
[default]
aws_access_key_id=YOUR_UNIQUE_ID
aws_secret_access_key=YOUR_SECRET_ACCESS_KEY
```

2. Build for production: `npm run build`
3. Push to S3: `npm run deploy`

You can combine the build and deploy into one step with `npm run build:deploy`.

## Known bugs
+ On Internet Explorer 10 and 11, if a user goes through the carousel form, hits submit, and the hits the browser "back" button, the form does not reset properly. This is despite `document.forms[0].reset()` being called in `index.html`.
