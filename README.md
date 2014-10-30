The Vertigo Stack
==============

[![Dependency Status](https://david-dm.org/marvinhq/stack.svg?style=flat)](https://david-dm.org/marvinhq/stack)
[![devDependency Status](https://david-dm.org/marvinhq/stack/dev-status.svg?style=flat)](https://david-dm.org/marvinhq/stack#info=devDependencies)
[![wercker status](https://app.wercker.com/status/110f26565441783b2e8e413520f3f44e/s "wercker status")](https://app.wercker.com/project/bykey/110f26565441783b2e8e413520f3f44e)

A modern web stack that will give you vertigo.

## Overview

![Warning](https://cdn2.iconfinder.com/data/icons/splashyIcons/warning_triangle.png "Warning") `This is not yet production ready!`

This is a web stack using modern bulletproof technologies:

* **[Codio](http://codio.com)** as Cloud IDE
* **[NodeJS](http://nodejs.org/api/) with [Express 4](http://expressjs.com/4x/api.html)** as backend software
* **[Mocha](http://visionmedia.github.io/mocha/) and [Chai](http://chaijs.com/api/)** as testing framework
* **[CoffeeScript](http://coffeescript.org/)** as scripting language
* **[Stylus](http://learnboost.github.io/stylus/)** as styling language
* **[Nunjucks](http://mozilla.github.io/nunjucks/)** as templating language
* **[Gulp](https://github.com/gulpjs/gulp/blob/master/README.md#gulp---)** as building tool
* **[Wercker](http://devcenter.wercker.com/)** as CI and Continuous Deployment tool

These technologies allow to be more productive by reducing the amount of code needed, and are all available in NPM, avoiding the need to have another environment like Ruby installed.

## Features

* Stylus and CoffeScript build on change with source maps support (clean-css source map not working yet, see issues)
* BrowserSync on Stylus/CoffeeScript code change
* HTML5 Boilerplate-lite with Google Analytics embedded
* Build with humans.txt update date
* Automatic testing/deployment with Wercker
* Server with compression enabled; threshold set to 1024

## Usage

### Dependencies

Every single command of this stack must be runned through NPM. This allows to avoid the need to install packages globally.
Assuming Node and NPM are installed, a simple `npm install` and you are ready to go.

### Configuration

#### Wercker *(optional)*

In order to use the CI, the repository must be handled by Wercker by enabling it on the Dashboard.

##### Wercker deployment

In order for Wercker to deploy, a deploy target must be added with the `WERCKER_PRIVATE_KEY` environment variable containing the private key that will connect to the server on which to deploy. The deploy might optionally be triggered automatically on master build success.

### Usage

* `npm start` to start the app in development mode
* `npm test` to test the app
* `npm run dev` to start CoffeeScript/Stylus watching with BrowserSync (assuming the app is `npm start`ed)
* `npm run build` to build the app
