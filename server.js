var path = require('path');

var compression = require('compression');
var express = require('express');
var nunjucks = require('nunjucks');
var winston = require('winston');
var app = express();

var watchHtml = false;

if (app.get('env') === 'development') {
  watchHtml = true;
  app.set('listening port', 3000);
  app.set('listening ip', '0.0.0.0');
  winston.cli();
} else if (app.get('env') === 'production') {
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

var nunjucksEnv = nunjucks.configure('views', { autoescape: true, express: app, watch: watchHtml });
nunjucksEnv.addGlobal('gaUuid', require('./package.json').vertigo['ga-uuid']);

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function onIndex(req, res) {
  res.render('index.html', { title: require('./package').name });
});

app.listen(app.get('listening port'), app.get('listening ip'), function onListen() {
  winston.info(`${require('./package').name} listening on ${app.get('listening ip')}:${app.get('listening port')}`);
});
