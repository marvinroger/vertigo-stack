winston = require 'winston'
express = require 'express'
app = express()
app.set 'view engine', 'jade'
if app.get('env') == 'development'
  app.set 'listening port', 3000
  app.set 'listening ip', '127.0.0.1'
  winston.cli()
else if app.get('env') == 'production'
  app.set 'listening port', process.env.PORT
  app.set 'listening ip', process.env.IP
else
  winston.error 'Wrong environment, only \'development\' and \'production\' allowed'
  process.exit 1

app.use express.static __dirname + '/public'

app.get '/', (req, res) ->
  res.render 'index', { title: 'MarvinHQ Stack' }

app.listen app.get('listening port'), app.get('listening ip'), ->
  winston.info 'MarvinHQ Stack listening on ' + app.get('listening ip') + ':' + app.get('listening port')
