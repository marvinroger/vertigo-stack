MarvinHQ Stack
=====

[![Dependency Status](https://david-dm.org/marvinhq/stack.svg)](https://david-dm.org/marvinhq/stack)
[![devDependency Status](https://david-dm.org/marvinhq/stack/dev-status.svg)](https://david-dm.org/marvinhq/stack#info=devDependencies)
[![wercker status](https://app.wercker.com/status/110f26565441783b2e8e413520f3f44e/s "wercker status")](https://app.wercker.com/project/bykey/110f26565441783b2e8e413520f3f44e)
[![Stories in Ready](https://badge.waffle.io/marvinhq/stack.png?label=ready&title=Ready)](https://waffle.io/marvinhq/stack)

MarvinHQ main stack for webapps.

## Overview

This is a stack bootstrap using modern technologies:

* **[NodeJS](http://nodejs.org/api/) with [Express 4](http://expressjs.com/4x/api.html)** as backend software
* **[Mocha](http://visionmedia.github.io/mocha/) and [Chai](http://chaijs.com/api/)** as testing framework
* **[CoffeeScript](http://coffeescript.org/)** as scripting language
* **[Stylus](http://learnboost.github.io/stylus/)** as styling language
* **[Jeet](http://mojotech.github.io/jeet/)** as grid system
* **[Jade](http://jade-lang.com/reference/)** as templating language
* **[Gulp](https://github.com/gulpjs/gulp/blob/master/README.md#gulp---)** as building tool
* **[Flightplan](https://github.com/pstadler/flightplan)** as deployment tool
* **[Wercker](http://devcenter.wercker.com/)** as CI

These technologies allow to be more productive by reducing the amount of code needed, and are all available in NPM, avoiding the need to have another environment like Ruby installed.

## Features

* Stylus and CoffeScript build on change
* Livereload on Stylus/CoffeeScript change
* HTML5 Boilerplate-lite with Google Analytics embedded
* Build with humans.txt update date
* Automatic testing/deployment with Wercker

## Usage

### Dependencies

Every single command of this stack must be runned throught NPM. This allows to avoid the need to install package globally.
Node and NPM are required, then `npm install`.

### Configuration

#### Config files

* **config/default.yml** contains common config between every environment. *(Example: name)*
* **config/deployment.coffee** contains config required for deployment. *(Example: host)*
* **config/development.yml** contains config required for development. *(Example: build_dest)*
* **config/production.yml** contains config required for production. *(Example: ga_token)*
* **config/runtime.yml** contains config required for runtime, very optional.

#### Wercker *(optional)*

In order to use the CI, Wercker needs to be configured with the repository containing this stack.

##### Wercker deployment

In order for Wercker to deploy, a deploy target must be added with the `WERCKER_PRIVATE_KEY` environment variable containing the private key that will connect to the server on which deploy. The deploy might optionaly be triggered automatically on master build success.

### Usage

* `npm start` to start the app in development mode
* `npm test` to test the app
* `npm run dev` to start CoffeeScript/Stylus watching
* `npm run build` to build the app
* `npm run deploy` after building to deploy the app
