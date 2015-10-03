var path = require('path');

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch'); // gulp.watch doesn't detect new files
var notifier = require('node-notifier');
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


//  ##################
//  # Error notifier #
//  ##################

var errored = false;

var errorHandler = function(task) {
  return function(error) {
    errored = true;
    console.log('Error in ' + task + ': ' + error.message);
    notifier.notify({
      title: 'Error in ' + task,
      message: error.message,
      icon: path.join(__dirname, 'error.png')
    });
  };
};

//  ######################
//  # Assets Compilation #
//  ######################

gulp.task('stylus', 'Process main.styl with sourcemap support', function() {
  return gulp.src('./app/css/main.styl').pipe(plumber(errorHandler('stylus'))).pipe(stylus({
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
  })).pipe(autoprefixer()).pipe(minifyCss()).pipe(sourcemaps.write('./')).pipe(gulp.dest('./public/css')).pipe(browserSync.stream({ match: '**/*.css' })); // match: to avoid full reload as browsersync won't find map file in the dom
});

gulp.task('es6-7', 'Process CoffeeScript files with sourcemap support', function() {
  return gulp.src('./app/js/**/*.js').pipe(plumber(errorHandler('es6-7'))).pipe(sourcemaps.init()).pipe(babel()).pipe(uglify()).pipe(sourcemaps.write('./')).pipe(gulp.dest('./public/js')).on('end', browserSync.reload);
});

//  ####################
//  # Development mode #
//  ####################

gulp.task('dev', 'Run stylus and es6-7 on file change with BrowserSync support', ['build'], function(done) {
  // Browsersync and nodemon

  var browserSyncStarted;
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['app/', 'public/', 'gulpfile.js'],
    env: { 'NODE_ENV': 'development' }
  }).on('start', function onAppStarted() {
    if (browserSyncStarted) {
      return;
    }
    browserSyncStarted = true;
    
    setTimeout(function onAppListening() {
      browserSync.init({
        proxy: '127.0.0.1:3000'
      });
    }, 2 * 1000);
  });

  // Watch to build

  watch('./app/assets/**/*', function(vinyl) {
    console.log(vinyl.path + ' was ' + vinyl.event + ', piping to public/...');
    runSequence('assets');
  });

  watch('./app/vendor/**/*', function(vinyl) {
    console.log(vinyl.path + ' was ' + vinyl.event + ', piping to public/vendor/...');
    runSequence('vendor');
  });

  watch('./app/css/**/*.styl', function(vinyl) {
    console.log(vinyl.path + ' was ' + vinyl.event + ', running Stylus...');
    runSequence('stylus');
  });

  watch('./app/js/**/*.js', function(vinyl) {
    console.log(vinyl.path + ' was ' + vinyl.event + ', running ES6-7 to ES5...');
    runSequence('es6-7');
  });

  // Watch to reload

  watch('./views/**/*.html', function(vinyl) {
    console.log(vinyl.path + ' was ' + vinyl.event + ', reloading browsers...');
    browserSync.reload();
  });
});

//  #########
//  # Build #
//  #########

gulp.task('assets', 'Copy assets to public directory', function() {
  return gulp.src('./app/assets/**/*', {
    base: './app/assets'
  }).pipe(plumber()).pipe(gulp.dest('./public')).on('end', browserSync.reload);
});

gulp.task('vendor', 'Copy vendor to public directory', function(done) {
  return gulp.src('./app/vendor/**/*', {
    base: './app'
  }).pipe(plumber()).pipe(gulp.dest('./public')).on('end', browserSync.reload);
});

gulp.task('humans', 'Update humans.txt update date', function() {
  var date = new Date();
  var formattedDate = date.getFullYear() + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2);
  return gulp.src(['./public/humans.txt']).pipe(plumber()).pipe(replace('#last_update#', formattedDate)).pipe(gulp.dest('./public'));
});

gulp.task('build:clean', 'Clean public directory for fresh public build', function(done) {
  del(['./public/**/*']).then(function() {
    done();
  });
});

gulp.task('build', 'Build public directory', function(done) {
  runSequence('build:clean', 'assets', 'vendor', ['stylus', 'es6-7', 'humans'], done);
});

gulp.task('dist:clean', 'Clean dist directory for fresh distribution build', function(done) {
  del(['./dist']).then(function() {
    done();
  });
});

gulp.task('dist:copy', 'Copy files to dist', function() {
  gulp.src('./{server.js,package.json,public/**/*,views/**/*}', {
    base: './'
  }).pipe(plumber()).pipe(gulp.dest('./dist'));
});

gulp.task('dist:imagemin', 'Minify images in build', function() {
  return gulp.src('./dist/public/img/**/*.{png,jpg,gif,svg}', {
    base: './dist'
  }).pipe(plumber()).pipe(imagemin({
    progressive: true
  })).pipe(gulp.dest('./dist'));
});

gulp.task('dist', 'Dist project into a dist directory', ['build'], function(done) {
  runSequence('dist:clean', 'dist:copy', 'dist:imagemin', function() {
    if (errored) {
      console.log('The build failed, cleaning dist directory');
      runSequence('dist:clean', function() {
        process.exit(-1);
      })
    }
  });
});
