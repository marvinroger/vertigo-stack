The Vertig![Icon](https://cdn1.iconfinder.com/data/icons/fs-icons-ubuntu-by-franksouza-/32/draw-spiral.png) Stack
=================

[![Dependency Status](https://david-dm.org/marvinroger/vertigo-stack.svg?style=flat)](https://david-dm.org/marvinroger/vertigo-stack)
[![devDependency Status](https://david-dm.org/marvinroger/vertigo-stack/dev-status.svg?style=flat)](https://david-dm.org/marvinroger/vertigo-stack#info=devDependencies)

A modern web stack that will give you vertigo.

## Overview

This is a web stack using modern bulletproof technologies:

* **[Codio](http://codio.com)** as Cloud IDE
* **[NodeJS](http://nodejs.org/api/) with [Express 4](http://expressjs.com/4x/api.html)** as backend software
* **[Mocha](http://visionmedia.github.io/mocha/) and [Chai](http://chaijs.com/api/)** as testing framework
* **[ES6-7](https://babeljs.io/)** compiled to ES5 as scripting language
* **[Stylus](http://learnboost.github.io/stylus/)** as styling language
* **[Nunjucks](http://mozilla.github.io/nunjucks/)** as templating language
* **[Gulp](https://github.com/gulpjs/gulp/blob/master/README.md#gulp---)** as building tool
* **[Wercker](http://devcenter.wercker.com/)** as CI and Continuous Deployment tool

These technologies allow to be more productive by reducing the amount of code needed, and are all available in NPM, avoiding the need to have another environment like Ruby installed.

## Features

* Stylus and ES6-7 build on change with source maps support
* BrowserSync on Stylus/ES6-7 code change
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
* `npm test` to unit test the app
* `npm run dev` to start ES6-7/Stylus watching with BrowserSync (assuming the app is `npm start`ed)
* `npm run build` to build the app
