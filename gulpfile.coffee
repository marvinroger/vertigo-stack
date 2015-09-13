gulp = require 'gulp'
help = require('gulp-help')(gulp)
autoprefixer = require 'gulp-autoprefixer'
browserSync = require('browser-sync').create()
coffee = require 'gulp-coffee'
del = require 'del'
imagemin = require 'gulp-imagemin'
koutoSwiss = require 'kouto-swiss'
minifyCss = require 'gulp-minify-css'
replace = require 'gulp-replace'
runSequence = require 'run-sequence'
sourcemaps = require 'gulp-sourcemaps'
stylus = require 'gulp-stylus'
uglify = require 'gulp-uglify'

######################
# Assets Compilation #
######################

gulp.task 'stylus', 'Process main.styl with sourcemap support', ->
  gulp.src './assets/styl/main.styl'
    .pipe stylus({
      sourcemap: { inline: true },
      use: koutoSwiss(),
      define: [{
        'ks-vendors-prefixes': false
      }]
    })
    .pipe sourcemaps.init({ loadMaps: true} )
    .pipe autoprefixer()
    .pipe minifyCss()
    .pipe sourcemaps.write()
    .pipe gulp.dest './public/css'
    .pipe browserSync.reload {stream: true}

gulp.task 'coffee', 'Process CoffeeScript files with sourcemap support', ->
  gulp.src './assets/coffee/**/*.coffee'
    .pipe sourcemaps.init()
    .pipe coffee()
    .pipe uglify()
    .pipe sourcemaps.write()
    .pipe gulp.dest './public/js'
    .pipe browserSync.reload {stream: true}
    
####################
# Development mode #
####################

gulp.task 'dev',
  'Run stylus and coffee on file change with BrowserSync support',
  ['stylus', 'coffee'], ->
    browserSync { proxy: '127.0.0.1:3000' }
    stylusWatcher = gulp.watch './assets/styl/**/*.styl', ['stylus']
    stylusWatcher.on 'change', (event) ->
      console.log event.path + ' was ' + event.type + ', running Stylus...'

    coffeeWatcher = gulp.watch './assets/coffee/**/*.coffee', ['coffee']
    coffeeWatcher.on 'change', (event) ->
      console.log event.path + ' was ' +
        event.type +', running CoffeeScript...'

#########
# Build #
#########
  
gulp.task 'clean', 'Clean css, js, dist directories for fresh build', (done) ->
  del([
    './dist'
    './public/css',
    './public/js'
  ]).then(done)

gulp.task 'copy', 'Copy files to build', ->
  gulp.src './{public,views}/**/*', {base: './'}
    .pipe gulp.dest './dist'
  gulp.src './{app.coffee,package.json}', {base: './'}
    .pipe gulp.dest './dist'

gulp.task 'imagemin', 'Minify images in build', ->
  gulp.src './dist/public/img/**/*.{png,jpg,gif,svg}', {base: './dist/'}
    .pipe imagemin {progressive: true}
    .pipe gulp.dest './dist'
    
gulp.task 'humans', 'Update humans.txt update date', () ->
  date = new Date
  formattedDate = date.getFullYear() + '/' +
    ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
    ('0' + date.getDate()).slice(-2)
  gulp.src ['./dist/public/humans.txt']
    .pipe replace '#last_update#', formattedDate
    .pipe gulp.dest './dist/public'

gulp.task 'build', 'Build project into a dist directory', ['clean'], ->
  runSequence ['stylus', 'coffee'], 'copy', ['imagemin', 'humans']
