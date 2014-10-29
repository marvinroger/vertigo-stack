compression = require 'compression'
express = require 'express'
nunjucks = require 'nunjucks'
winston = require 'winston'
app = express()
nunjucks.configure 'views', { autoescape: true, express: app }
if app.get('env') == 'development'
  app.set 'listening port', 3000
  app.set 'listening ip', '0.0.0.0'
  winston.cli()
else if app.get('env') == 'production'
  if not process.env.PORT or not process.env.IP
    winston.error 'Missing PORT or IP'
    process.exit 1
  app.set 'listening port', process.env.PORT
  app.set 'listening ip', process.env.IP
else
  winston.error 'Wrong NODE_ENV'
  process.exit 1

app.use compression()
app.use express.static __dirname + '/public'

app.get '/', (req, res) ->
  res.render 'index.html', { title: 'MarvinHQ Stack' }

app.listen app.get('listening port'), app.get('listening ip'), ->
  winston.info 'MarvinHQ Stack listening on ' +
    app.get('listening ip') + ':' + app.get('listening port')
