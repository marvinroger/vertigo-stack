'use strict';

let path = require('path');
let compression = require('compression');
let express = require('express');
let nunjucks = require('nunjucks');
let winston = require('winston');
let app = express();

//  ######################
//  # Environment config #
//  ######################

if (app.get('env') === 'development') {
  app.set('listening port', 3000);
  app.set('listening ip', '0.0.0.0');
  winston.cli();
} else if (app.get('env') === 'production') {
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, { timestamp: true });
  if (!process.env.PORT || !process.env.IP) {
    winston.error('Missing PORT or IP');
    process.exit(1);
  }
  app.set('listening port', process.env.PORT);
  app.set('listening ip', process.env.IP);
} else {
  winston.error('Wrong NODE_ENV');
  process.exit(1);
}

let nunjucksEnv = nunjucks.configure('views', { autoescape: true, express: app, watch: (app.get('env') === 'development') });

//  #################
//  # Views globals #
//  #################

nunjucksEnv.addGlobal('gaUuid', require('./package.json').vertigo['ga-uuid']);

//  #######
//  # App #
//  #######

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function onIndex (req, res) {
  res.render('index.html', { title: require('./package').name });
});

app.listen(app.get('listening port'), app.get('listening ip'), function onListen () {
  winston.info(`${require('./package').name} listening on ${app.get('listening ip')}:${app.get('listening port')}`);
});
