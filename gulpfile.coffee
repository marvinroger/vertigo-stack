config = require 'config'
gulp = require 'gulp'
clean = require 'gulp-clean'
coffee = require 'gulp-coffee'
livereload = require 'gulp-livereload'
replace = require 'gulp-replace'
runSequence = require 'run-sequence'
stylus = require 'gulp-stylus'

gulp.task 'stylus', ->
  gulp.src './assets/styl/main.styl'
    .pipe stylus { compress: true }
    .pipe gulp.dest './public/css'

gulp.task 'coffee', ->
  gulp.src './assets/coffee/**/*.coffee'
    .pipe coffee()
    .pipe gulp.dest './public/js'

gulp.task 'build-copy', ->
  gulp.src('./{public,views}/**/*', {base: './'})
    .pipe(gulp.dest(config.build_dest));
  gulp.src('./{app.coffee,package.json}', {base: './'})
    .pipe(gulp.dest(config.build_dest));

gulp.task 'build-replace', ->
  date = new Date
  gulp.src [config.build_dest + 'public/humans.txt']
    .pipe replace '#last_update#', date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2)
    .pipe gulp.dest config.build_dest + 'public'

gulp.task 'clean', ->
  if not process.env.CI
    gulp.src(config.build_dest, {read: false})
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

gulp.task 'build', ['clean', 'stylus', 'coffee'], ->
  runSequence 'build-copy', 'build-replace'
