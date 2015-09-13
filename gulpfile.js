var gulp = require('gulp');
var help = require('gulp-help')(gulp);
var babel = require('gulp-babel');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var del = require('del');
var imagemin = require('gulp-imagemin');
var koutoSwiss = require('kouto-swiss');
var minifyCss = require('gulp-minify-css');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');

//  ######################
//  # Assets Compilation #
//  ######################

gulp.task('stylus', 'Process main.styl with sourcemap support', function() {
  return gulp.src('./assets/styl/main.styl').pipe(stylus({
    sourcemap: {
      inline: true
    },
    use: koutoSwiss(),
    define: [
      {
        'ks-vendors-prefixes': false
      }
    ]
  })).pipe(sourcemaps.init({
    loadMaps: true
  })).pipe(autoprefixer()).pipe(minifyCss()).pipe(sourcemaps.write()).pipe(gulp.dest('./public/css')).pipe(browserSync.reload({
    stream: true
  }));
});

gulp.task('es6-7', 'Process CoffeeScript files with sourcemap support', function() {
  return gulp.src('./assets/es6-7/**/*.js').pipe(sourcemaps.init()).pipe(babel()).pipe(uglify()).pipe(sourcemaps.write()).pipe(gulp.dest('./public/js')).pipe(browserSync.reload({
    stream: true
  }));
});

//  ####################
//  # Development mode #
//  ####################

gulp.task('dev', 'Run stylus and es6-7 on file change with BrowserSync support', ['stylus', 'es6-7'], function() {
  browserSync({
    proxy: '127.0.0.1:3000'
  });
  var stylusWatcher = gulp.watch('./assets/styl/**/*.styl', ['stylus']);
  stylusWatcher.on('change', function(event) {
    return console.log(event.path + ' was ' + event.type + ', running Stylus...');
  });
  var es67Watcher = gulp.watch('./assets/es6-7/**/*.js', ['es6-7']);
  return es67Watcher.on('change', function(event) {
    return console.log(event.path + ' was ' + event.type(+', running ES6-7 to ES5...'));
  });
});

//  #########
//  # Build #
//  #########

gulp.task('clean', 'Clean css, js, dist directories for fresh build', function(done) {
  return del(['./dist', './public/css', './public/js']).then(done);
});

gulp.task('copy', 'Copy files to build', function() {
  gulp.src('./{public,views}/**/*', {
    base: './'
  }).pipe(gulp.dest('./dist'));
  return gulp.src('./{app.js,package.json}', {
    base: './'
  }).pipe(gulp.dest('./dist'));
});

gulp.task('imagemin', 'Minify images in build', function() {
  return gulp.src('./dist/public/img/**/*.{png,jpg,gif,svg}', {
    base: './dist/'
  }).pipe(imagemin({
    progressive: true
  })).pipe(gulp.dest('./dist'));
});

gulp.task('humans', 'Update humans.txt update date', function() {
  var date = new Date();
  var formattedDate = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
  return gulp.src(['./dist/public/humans.txt']).pipe(replace('#last_update#', formattedDate)).pipe(gulp.dest('./dist/public'));
});

gulp.task('build', 'Build project into a dist directory', ['clean'], function() {
  return runSequence(['stylus', 'es6-7'], 'copy', ['imagemin', 'humans']);
});
