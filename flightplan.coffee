Flightplan = require 'flightplan'
plan = new Flightplan
tmpDir = 'marvinhq-' + new Date.getTime()

plan.briefing {
  destinations: {
    production: {
      host: 'host.fr',
      username: 'flightplan',
      agent: process.env.SSH_AUTH_SOCK
    }
  }
}

plan.local (local) ->
  local.log 'Copy files to remote host'
  files = local.exec 'git ls-files', { silent: true }
  local.transfer files, '/tmp/' + tmpDir

plan.remote (remote) ->
  remote.log 'Move folder to web root'
  remote.sudo 'cp -R /tmp/' + tmpDir + ' ~', { user: 'www' }
  remote.rm '-rf /tmp/' + tmpDir

### TOFINISH
// run commands on remote hosts (destinations)
plan.remote(function(remote) {
  remote.log('Move folder to web root');
  remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: 'www'});
  remote.rm('-rf /tmp/' + tmpDir);

  remote.log('Install dependencies');
  remote.sudo('npm --production --prefix ~/' + tmpDir
                            + ' install ~/' + tmpDir, {user: 'www'});

  remote.log('Reload application');
  remote.sudo('ln -snf ~/' + tmpDir + ' ~/pstadler-sh', {user: 'www'});
  remote.sudo('pm2 reload pstadler-sh', {user: 'www'});
});

// run more commands on localhost afterwards
plan.local(function(local) { /* ... */ });
// ...or on remote hosts
plan.remote(function(remote) { /* ... */ });

// executed if flightplan succeeded
plan.success(function() { /* ... */ });

// executed if flightplan failed
plan.disaster(function() { /* ... */ });

// always executed after flightplan finished
plan.debriefing(function() { /* ... */ });
###
