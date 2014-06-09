Flightplan = require 'flightplan'
plan = new Flightplan
config = require 'config'
tmpDir = config.name + '-' + new Date.getTime()

plan.briefing {
  destinations: {
    production: {
      host: config.host,
      username: config.username,
      agent: process.env.SSH_AUTH_SOCK
    }
  }
}

plan.local (local) ->
  local.log 'Copy files to remote host'
  local.transfer config.build_dest, '/tmp/' + tmpDir

plan.remote (remote) ->
  remote.log 'Move folder to web root'
  remote.sudo 'cp -R /tmp/' + tmpDir + ' /var/www', { user: 'www' }
  remote.rm '-rf /tmp/' + tmpDir
  remote.log('Install dependencies');
  remote.with 'cd /var/www' + tmpDir, ->
    remote.sudo 'npm install --production', {user: 'www'}

  remote.log 'Reload application'
  remote.sudo 'ln -snf /var/www' + tmpDir + ' /var/www/marvinhq', {user: 'www'}
  remote.sudo 'pm2 reload marvinhs', {user: 'www'}

plan.success ->
  console.log 'Successfully deployed.'

plan.disaster ->
  console.log 'Error while deployment.'
