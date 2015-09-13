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
var nodemon = require('gulp-nodemon');

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
  })).pipe(autoprefixer()).pipe(minifyCss()).pipe(sourcemaps.write('./')).pipe(gulp.dest('./public/css')).pipe(browserSync.stream({ match: '**/*.css' })); // match: to avoid full reload ad browsersync won't find map file in the dom
});

gulp.task('es6-7', 'Process CoffeeScript files with sourcemap support', function() {
  return gulp.src('./assets/es6-7/**/*.js').pipe(sourcemaps.init()).pipe(babel()).pipe(uglify()).pipe(sourcemaps.write('./')).pipe(gulp.dest('./public/js')).pipe(browserSync.stream());
});

//  ####################
//  # Development mode #
//  ####################

gulp.task('dev', 'Run stylus and es6-7 on file change with BrowserSync support', ['stylus', 'es6-7'], function(done) {
  nodemon({
    script: 'app.js',
    ext: 'js',
    ignore: ['assets/', 'public/', 'gulpfile.js'],
    env: { 'NODE_ENV': 'development' }
  }).on('start', function onAppStarted() {
    setTimeout(function onAppListening() {
      browserSync.init({
        proxy: '127.0.0.1:3000'
      });
    }, 2 * 1000);
  });
  var stylusWatcher = gulp.watch('./assets/styl/**/*.styl', ['stylus']);
  stylusWatcher.on('change', function(event) {
    console.log(event.path + ' was ' + event.type + ', running Stylus...');
  });
  var es67Watcher = gulp.watch('./assets/es6-7/**/*.js', ['es6-7']);
  es67Watcher.on('change', function(event) {
    console.log(event.path + ' was ' + event.type(+', running ES6-7 to ES5...'));
  });
});

//  #########
//  # Build #
//  #########

gulp.task('clean', 'Clean css, js, dist directories for fresh build', function(done) {
  del(['./dist', './public/css', './public/js']).then(function() {
    done();
  });
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

gulp.task('build', 'Build project into a dist directory', function(done) {
  runSequence('clean', ['stylus', 'es6-7'], 'copy', ['imagemin', 'humans'], done);
});
