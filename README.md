The Vertigo Stack
=================

[![Dependency Status](https://david-dm.org/marvinroger/vertigo-stack.svg?style=flat)](https://david-dm.org/marvinroger/vertigo-stack) [![devDependency Status](https://david-dm.org/marvinroger/vertigo-stack/dev-status.svg?style=flat)](https://david-dm.org/marvinroger/vertigo-stack#info=devDependencies)


![The Vertigo Stack](http://i.imgur.com/VIfziO0.png "The Vertigo Stack")

A modern web stack that will give you vertigo.

## Overview

This is a web stack using modern bulletproof technologies:

* **[NodeJS](http://nodejs.org/api/) with [Express 4](http://expressjs.com/4x/api.html)** as backend software
* **[Mocha](http://visionmedia.github.io/mocha/) and [Chai](http://chaijs.com/api/)** as testing framework
* **[ES6-7 (using babel)](https://babeljs.io/)** compiled to ES5 as scripting language
* **[Stylus](http://learnboost.github.io/stylus/)** as styling language
* **[Nunjucks](http://mozilla.github.io/nunjucks/)** as templating language
* **[Gulp](https://github.com/gulpjs/gulp/)** as building tool
* **[Wercker](http://devcenter.wercker.com/)** as CI and Continuous Deployment tool

These technologies allow to be more productive by reducing the amount of code needed, and are all available in NPM, avoiding the need to have another environment like Ruby installed.

## Features

* automatically reload the application when node code changed
* Stylus and ES6-7 build on change with source maps support
* BrowserSync on Stylus/ES6-7/HTML view code change
* HTML5 Boilerplate-lite with Google Analytics embedded
* humans.txt update date
* Automatic testing/deployment with Wercker
* Server with compression enabled; threshold set to 1024

## Installation

Simply clone this repository and edit `package.json`.

## Use

### File tree

```
-- app <- front end code
-- -- css <- stylus files
-- -- js <- es6/7 files
-- -- assets <- files not to touch
-- -- vendor <- vendor files not to touch
-- public <- app directory, built
-- views <- back end nunjucks views
-- test <- back end mocha tests

```

### Configuration

#### Wercker *(optional)*

In order to use the CI, the repository must be handled by Wercker by enabling it on the Dashboard.

##### Wercker deployment

In order for Wercker to deploy, a deploy target must be added with the `WERCKER_PRIVATE_KEY` environment variable containing the private key that will connect to the server on which to deploy. The deploy might optionally be triggered automatically on master build success.

### Usage

* `npm start` to start the app in development mode
* `npm test` to unit test the app
* `npm run dev` to start the app in development mode while ES6-7/Stylus/HTML watching with BrowserSync
* `npm run dist` to distribute the app for release
