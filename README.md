## Getting Started
To get started:
1. Clone down the project repo
2. Make sure [rbenv](https://github.com/sstephenson/rbenv) is installed on your machine
3. Download Ruby 2.3.0, the version used in this project: `rbenv install 2.0.0`
4. Switch to that version: `rbenv local 2.3.0`
5. Make sure [Bundler](http://bundler.io/) is installed on your machine: `gem install bundler`
6. Install project packages: `bundle install`


## Structure
### `raw/`
Contains files that will eventually be compiled or otherwise transformed with Webpack.

+ `raw/js`: Place all ES2015 modules and entry points here. Right now, there is a form module for old browsers and for modern browsers, plus an entry point for each (I'm sure you can figure out which is which by the file names). The only difference between the old-browser form module and the new one is that the old uses the CSS `left` property instead of `transform` to deal with carousel actions.
+ `raw/bg`: Place all background images here. That's because SCSS files `require()` them and will therefore be part of the Webpack build process.
+ `raw/scss`: Place all SCSS files -- partials and entry points -- here.

### `source/`
Contains files that Middleman will eventually minify and move to the `build/` directory.

+ `source/img`: Contains all images **except** background images.
+ `source/layouts`: Contains base ERB templates.
+ `source/bg`: A `.gitignore`d directory containing Webpack-processed background images
+ `source/css`: A `.gitignore`d directory containing Webpack-processed CSS.
+ `source/javascripts`: A `.gitignore`d directory containing Webpack-processed JavaScript.

### `test/`
Contains unit tests powered by [Mocha](https://mochajs.org/), [Chai](http://chaijs.com/) and [Sinon](http://sinonjs.org/).

### `data/`
Contains YAML files, the data of which is fed into some ERB templates.

### `.babelrc`
Tells Babel how to compile our JavaScript. There are two settings. They're explained later in this README.

### `browserslist`
Tells Autoprefixer what browsers we care about.

### `postcss.config.js`
Tells Webpack what PostCSS stuff we want it to do.

### `webpack.config.js`
The configuration for a modern-browser Webpack build. More on this later.

### `webpack.config.old.js`
The configuration for a legacy-browser Webpack build. More on this later.

### `critical.js`
Inline critical CSS in all of the built HTML files using [inline-critical](https://www.npmjs.com/package/inline-critical).


## Commands
+ `npm run dev`: Fire up the development server. This will enable live reloading of templates, JavaScript and CSS.
+ `npm run build`: Build for production.
+ `npm run middleman`: Build the modern and legacy JavaScript bundle. Then do the Middleman build process. Then inline critical CSS.
+ `npm run old-js`: Using Webpack, build a JavaScript bundle for old browsers.
+ `npm run es3`: After we've built our bundle for old browsers, use [es3ify](https://www.npmjs.com/package/es3ify) to make sure the syntax is OK.
+ `npm run critical`: Inline critical CSS
+ `npm test`: Run unit tests.


## Why the weird build process?
The short answer: We want to support IE 7 and 8, but we still want to write modern JavaScript. So when you do `npm run build`, here's what happens:

+ Using `webpack.config.old.js` and the entry point `raw/js/index-old.js`, our JavaScript is compiled into `bundle-es3.js` and placed in `source/javascripts`.
+ `bundle-es3.js` is run through [es3ify](https://www.npmjs.com/package/es3ify) to make it compliant with IE 8 and below.
+ Using `webpack.config.js`, our JavaScript is compiled from the entry point `raw/js/index.js` into `bundle.js` and placed in `source/javascripts`. It uses [babel-preset-es2015](http://babeljs.io/docs/plugins/preset-es2015/) straight up.
+ Middleman then does its production build, minifying everything in `source/` and placing it in `build/`.
+ Finally, critical CSS is inlined.

If you look at the bottom of `source/layouts/layout.erb`, you'll notice that `bundle-es3.js` is only included for old IE versions.


## Deploying
To deploy, the project uses the middleman-s3_sync gem to push and compile the site to s3 after building.

By default, in config.rb, config.after_build is set to false. Set this to true. Check that your AWS_ACCESS_KEY and AWS_ACCESS_SECRET environment variables are set, and then run `bundle exec middleman build`.

In your terminal, you should see s3_sync applying any updates to files for the project. You can also check the project s3 bucket to ensure that all files have been synced there. Change config.after_build back to its default of false after deploying.

## Known bugs
+ On Internet Explorer 10 and 11, if a user goes through the carousel form, hits submit, and the hits the browser "back" button, the form does not reset properly. This is despite `document.forms[0].reset()` being called in `index.html`.
