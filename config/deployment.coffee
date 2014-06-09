host = 'host.fr'
username = 'flightplan'
if process.env.CI
  buildDest = process.env.WERCKER_OUTPUT_DIR
else
  buildDest = './dist/'

module.exports = {
  build_dest: buildDest,
  host: host,
  username: username
}
