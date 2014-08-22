gulp = require 'gulp'
help = require('gulp-help')(gulp)
clean = require 'gulp-clean'
coffee = require 'gulp-coffee'
csso = require 'gulp-csso'
imagemin = require 'gulp-imagemin'
livereload = require 'gulp-livereload'
replace = require 'gulp-replace'
runSequence = require 'run-sequence'
sourcemaps = require 'gulp-sourcemaps'
stylus = require 'gulp-stylus'
uglify = require 'gulp-uglify'

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

gulp.task 'dev', 'Run stylus and coffee on files changes', ['stylus', 'coffee'], () ->
  livereload.listen();
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

gulp.task 'clean', 'Clean css, js, shippable directories for fresh build', ->
  gulp.src './shippable', {read: false}
    .pipe clean()
  gulp.src './public/css', {read: false}
    .pipe clean()
  gulp.src './public/js', {read: false}
    .pipe clean()


gulp.task 'build', 'Build project into a shippable directory', ->
  runSequence 'clean', 'stylus', 'coffee'

  # Copy files
  gulp.src './{public,views}/**/*', {base: './'}
    .pipe gulp.dest './shippable'
  gulp.src './{app.coffee,package.json}', {base: './'}
    .pipe gulp.dest './shippable'

  # Minify images
  gulp.src './public/img/**/*.{png,jpg,gif,svg}', {base: './'}
    .pipe imagemin {progressive: true}
    .pipe gulp.dest './shippable'

  # Update humans.txt
  date = new Date
  gulp.src ['./shippable/public/humans.txt']
    .pipe replace '#last_update#', date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2)
    .pipe gulp.dest './shippable/public'
