express = require 'express'
app = express()
app.set 'view engine', 'jade'

app.get '/', (req, res) ->
  res.render 'index', { title: 'MarvinHQ Stack' }


app.listen 3000
