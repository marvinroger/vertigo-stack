gulp = require 'gulp'
clean = require 'gulp-clean'
coffee = require 'gulp-coffee'
livereload = require 'gulp-livereload'
stylus = require 'gulp-stylus'

gulp.task 'stylus', ->
  gulp.src './assets/styl/main.styl'
    .pipe stylus { compress: true }
    .pipe gulp.dest './public/css'

gulp.task 'coffee', ->
  gulp.src './assets/coffee/**/*.coffee'
    .pipe coffee()
    .pipe gulp.dest './public/js'

gulp.task 'clean', ->
  gulp.src('./dist', {read: false})
    .pipe(clean());

gulp.task 'default', ['stylus', 'coffee'], () ->
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

gulp.task 'build', ['clean', 'stylus', 'coffee'], () ->
  gulp.src('./{public,views}/**/*', {base: './'})
    .pipe(gulp.dest('./dist/'));
  gulp.src('./{app.coffee,package.json}', {base: './'})
    .pipe(gulp.dest('./dist/'));
