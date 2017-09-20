## Dependencies
+ Node 6.11.3
+ Yarn 0.27.5

These versions are pinned in `Dockerfile`, so you shouldn't have to worry about it.


## Set-up
+ Create an `env-docker` file in the root. Fill it out according to what's in `env.sample`.
+ Run `make`. This will take a few minutes the first time you run it as Docker has to build the image from scratch.


## Files and directories of note
### `source/`
Contains files that Middleman will eventually process and move to the `build/` directory.

+ Everything in `source/scss` gets compiled into `source/css`, which is `.gitignore`d.
+ `source/javascripts` contains ES6 modules that are eventually bundled into `source/javascripts/bundle.js`, which is ignored from version control.

### `utils/`
+ `deploy.sh`: A shell script for deployment to S3.
+ `critical.js`: A Node script for inlining critical CSS.

### `data/`
Contains YAML files, the data of which is fed into some ERB templates.

### `browserslist`
Tells Autoprefixer what browsers we care about.

### `postcss.config.js`
Tells Webpack what PostCSS stuff we want it to do.


## Commands
+ `yarn run dev`: Fire up the development server. This will enable live reloading of templates, JavaScript and CSS.
+ `yarn run build`: Build for production.
+ `yarn run clean`: Clean out the `build/` directory.
+ `yarn run middleman`: Do the official Middleman build process.
+ `yarn run critical`: Inline critical CSS.
+ `yarn run js:dev`: Put Webpack in watch mode.
+ `yarn run js:prod`: Build the Webpack bundle for production.
+ `yarn run deploy`: Deploy to S3.
+ `yarn run build:deploy`: Build for production, then deploy.

You'll typically only need these three: `yarn run dev`, `yarn run build` and `yarn run deploy`.


## Deployment
1. Build for production: `yarn run build`
2. Push to S3: `yarn run deploy`

You can combine the build and deploy into one step with `yarn run build:deploy`.


## Browser support
We autoprefix for everything in `browserslist` but officially only support modern browsers plus Internet Explorer 9.
