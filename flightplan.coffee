Flightplan = require 'flightplan'
plan = new Flightplan
config = require 'config'
replace = require 'replace'

plan.briefing {
  destinations: {
    production: {
      host: config.host,
      username: config.username,
      agent: process.env.SSH_AUTH_SOCK
    }
  }
}


# Setup (install necessary tools)

plan.remote 'setup', (remote) ->
  remote.log 'Update'
  remote.exec 'apt-get update'
  remote.log 'Upgrade'
  remote.exec 'apt-get dist-upgrade -y'

  remote.log 'Add PPAs'
  remote.exec 'apt-get install python-software-properties'
  remote.exec 'add-apt-repository ppa:keithw/mosh'
  remote.exec 'apt-add-repository ppa:chris-lea/node.js'
  remote.exec 'apt-get update'

  remote.log 'Install Nginx'
  remote.exec 'apt-get install -y nginx'
  remote.exec "sed -i 's/^server_names_hash_bucket_size.*/server_names_hash_bucket_size 64;/' /etc/nginx/nginx.conf"

  remote.log 'Install Mosh'
  remote.exec 'apt-get install -y mosh'

  remote.log 'Install Node'
  remote.exec 'apt-get install -y nodejs'

  remote.log 'Install PM2'
  remote.exec 'npm install pm2 -g'


# Init (first deploy)

plan.remote 'init', (remote) ->
  remote.exec 'mkdir -p /var/www/' + config.name

plan.local 'init', (local) ->
  local.log 'Copy files to remote host'
  local.transfer config.build_dest, '/var/www/' + config.name

  replace {
    regex: '#DOMAIN#',
    replacement: config.host,
    paths: ['./config/nginx/server'],
    silent: true,
  }

plan.remote 'init', (remote) ->
  remote.with 'cd /var/www/' + config.name, ->
    remote.log 'Install dependencies'
    remote.exec 'npm install --production'

    remote.log 'Init PM2 application'
    remote.exec 'NODE_ENV=production PORT=3001 pm2 start app.coffee --name "' + config.name + '"'

  remote.log 'Set PM2 at startup'
  remote.exec 'pm2 startup ubuntu'
  remote.exec 'pm2 save'

  remote.log 'Setup nginx site'
  remote.exec 'pm2 startup ubuntu'
  remote.exec 'pm2 save'

plan.local 'init', (local) ->
  local.transfer ['./config/nginx/server'], '/etc/nginx/sites-available'

plan.remote 'init', (remote) ->
  remote.exec 'rm /etc/nginx/sites-available/default'
  remote.exec 'rm /etc/nginx/sites-enabled/default'
  remote.exec 'mv /etc/nginx/sites-available/server /etc/nginx/sites-available/' + config.host
  remote.exec 'ln -s /etc/nginx/sites-available/' + config.host + ' /etc/nginx/sites-enabled/' + config.host
  remote.exec 'service nginx restart'


# Deploy

plan.local 'deploy', (local) ->
  local.log 'Copy files to remote host'
  local.transfer config.build_dest, '/var/www/' + config.name

plan.remote 'deploy', (remote) ->
  remote.log 'Install dependencies'
  remote.with 'cd /var/www/' + config.name, ->
    remote.exec 'npm install --production'

  remote.log 'Reload application'
  remote.exec 'pm2 gracefulReload ' + config.name

plan.success ->
  console.log 'Flight successful.'

plan.disaster ->
  console.log 'Flight aborted.'
