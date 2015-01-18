The Vertigo Stack
=================

[![Dependency Status](https://david-dm.org/marvinhq/vertigo-stack.svg?style=flat)](https://david-dm.org/marvinhq/vertigo-stack)
[![devDependency Status](https://david-dm.org/marvinhq/vertigo-stack/dev-status.svg?style=flat)](https://david-dm.org/marvinhq/vertigo-stack#info=devDependencies)

A modern web stack that will give you vertigo.

## Overview

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

* Stylus and CoffeScript build on change with source maps support
* BrowserSync on Stylus/CoffeeScript code change
* HTML5 Boilerplate-lite with Google Analytics embedded
* Build with humans.txt update date
* Automatic testing/deployment with Wercker
* Server with compression enabled; threshold set to 1024

## Installation

See [installation](https://github.com/MarvinHQ/slush-vertigo-stack#installation).

## Use

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
