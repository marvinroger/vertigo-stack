gulp = require 'gulp'
help = require('gulp-help')(gulp)
coffee = require 'gulp-coffee'
csso = require 'gulp-csso'
del = require 'del'
imagemin = require 'gulp-imagemin'
livereload = require 'gulp-livereload'
replace = require 'gulp-replace'
runSequence = require 'run-sequence'
sourcemaps = require 'gulp-sourcemaps'
stylus = require 'gulp-stylus'
uglify = require 'gulp-uglify'

######################
# Assets Compilation #
######################

gulp.task 'stylus', 'Compile and optimize main.styl', ->
  gulp.src './assets/styl/main.styl'
    .pipe stylus()
    .pipe csso()
    .pipe gulp.dest './public/css'

gulp.task 'coffee', 'Compile and optimize coffeescript files with sourcemap support', ->
  gulp.src './assets/coffee/**/*.coffee'
    .pipe sourcemaps.init()
    .pipe coffee()
    .pipe uglify()
    .pipe sourcemaps.write()
    .pipe gulp.dest './public/js'
    
####################
# Development mode #
####################

gulp.task 'dev', 'Run stylus and coffee on files changes', ['stylus', 'coffee'], () ->
  livereload.listen()
  stylusWatcher = gulp.watch './assets/styl/**/*.styl', ['stylus']
  stylusWatcher.on 'change', (event) ->
    console.log event.path + ' was ' + event.type + ', running Stylus...'

  cssWatcher = gulp.watch './public/css/**/*.css'
  cssWatcher.on 'change', livereload.changed

  coffeeWatcher = gulp.watch './assets/coffee/**/*.coffee', ['coffee']
  coffeeWatcher.on 'change', (event) ->
    console.log event.path + ' was ' + event.type + ', running CoffeeScript...'

  jsWatcher = gulp.watch './public/js/**/*.js'
  jsWatcher.on 'change', livereload.changed

#########
# Build #
#########
  
gulp.task 'clean', 'Clean css, js, dist directories for fresh build', (done) ->
  del [
    './dist'
    './public/css',
    './public/js'
  ], done

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
  formattedDate = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2)
  gulp.src ['./dist/public/humans.txt']
    .pipe replace '#last_update#', formattedDate
    .pipe gulp.dest './dist/public'

gulp.task 'build', 'Build project into a dist directory', ['clean'], ->
  runSequence ['stylus', 'coffee'], 'copy', ['imagemin', 'humans']
