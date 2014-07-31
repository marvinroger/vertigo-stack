winston = require 'winston'
config = require 'config'
express = require 'express'
app = express()
app.set 'view engine', 'jade'
env = process.env.NODE_ENV || 'development'
if env == 'development'
  app.set 'listening port', 3000
  winston.cli()
else if env == 'production'
  app.set 'listening port', process.env.PORT

app.use express.static __dirname + '/public'

app.get '/', (req, res) ->
  res.render 'index', { title: 'MarvinHQ Stack' }

app.listen app.get('listening port'), 'localhost', ->
  winston.info config.name + ' listening on localhost:' + app.get('listening port')
