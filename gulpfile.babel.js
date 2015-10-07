var gulp = require('gulp-help')(require('gulp')); // adds a default help task
var plumber = require('gulp-plumber'); // help to avoid crash if error in a task
var watch = require('gulp-watch'); // gulp.watch doesn't detect new files
var notifier = require('node-notifier'); // desktop notifications
var autoprefixer = require('gulp-autoprefixer'); // autoprefix css
var browserSync = require('browser-sync').create(); // auto refresh browsers
var del = require('del'); // delete files
var imagemin = require('gulp-imagemin'); // optimize images
var koutoSwiss = require('kouto-swiss'); // Stylus mixins
var minifyCss = require('gulp-minify-css'); // minify css
var replace = require('gulp-replace'); // replace text in files, useful for humans.txt update date
var runSequence = require('run-sequence'); // run tasks in series or in parallel
var sourcemaps = require('gulp-sourcemaps'); // generate source maps
var stylus = require('gulp-stylus'); // compile stylus to CSS
var uglify = require('gulp-uglify'); // minify JS
var nodemon = require('gulp-nodemon-tempfix'); // reload server JS app on change / restart on crash
var browserify = require('browserify'); // helps using modules client side
var babelify = require('babelify'); // Babel transform for browserify
var source = require('vinyl-source-stream'); // helper for browserify text stream to gulp pipeline
var buffer = require('vinyl-buffer'); // helper for browserify
var rev = require('gulp-rev'); // Cache bust
var revReplace = require('gulp-rev-replace'); // Replace cache busted occurences in files
var riotify = require('riotify'); // Riot transform for browserify
var newer = require('gulp-newer'); // only process changed files in tasks

//  ##################
//  # Error notifier #
//  ##################

var errored = false;

var errorHandler = function (task) {
  return function (error) {
    errored = true;
    console.log(`Error in ${task}: ${error.message}`);
    notifier.notify({
      title: `Error in ${task}`,
      message: error.message,
      icon: require('path').join(__dirname, 'error.png')
    });
  };
};

//  ######################
//  # Assets Compilation #
//  ######################

gulp.task('stylus', 'Process main.styl with sourcemap support', function () {
  return gulp.src('./app/css/**/[^_]*.styl')
    .pipe(plumber(errorHandler('stylus')))
    .pipe(newer({ dest: './public/css', 'ext': '.css' }))
    .pipe(stylus({
      sourcemap: {
        inline: true
      },
      use: koutoSwiss(),
      define: [
        {
          'ks-vendors-prefixes': false
        }
      ]
    }))
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream({ match: '**/*.css' })); // match: to avoid full reload as browsersync won't find map file in the dom
});

gulp.task('es6-7', 'Process ES6/7 files with sourcemap support', function () {
  return browserify('./app/js/app.js')
    .transform(riotify, { type: 'es6' })
    .transform(babelify.configure({ optional: ['runtime'] }))
    .bundle()
    .on('error', function (error) {
      errorHandler('es6-7')(error);
      this.emit('end');
    }) // Don't crash if failed, plumber alone doesn't work with browserify
    .pipe(plumber(errorHandler('es6-7'))) // Not sure if still needed
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'))
    .on('end', browserSync.reload);
});

//  ####################
//  # Development mode #
//  ####################

gulp.task('dev', 'Run stylus and es6-7 on file change with BrowserSync support', ['build'], function (done) {
  // Browsersync and nodemon

  var browserSyncStarted;
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['app/', 'public/', 'gulpfile.js'],
    env: { 'NODE_ENV': 'development' }
  }).on('start', function onAppStarted () {
    if (browserSyncStarted) {
      return;
    }
    browserSyncStarted = true;

    setTimeout(function onAppListening () {
      browserSync.init({
        proxy: '127.0.0.1:3000'
      });
    }, 2 * 1000);
  });

  // Watch to build

  watch('./app/assets/**/*', function (vinyl) {
    console.log(`${vinyl.path} was ${vinyl.event}, piping to public/...`);
    runSequence('assets');
  });

  watch('./app/vendor/**/*', function (vinyl) {
    console.log(`${vinyl.path} was ${vinyl.event}, piping to public/vendor/...`);
    runSequence('vendor');
  });

  watch('./app/css/**/*.styl', function (vinyl) {
    console.log(`${vinyl.path} was ${vinyl.event}, running Stylus...`);
    runSequence('stylus');
  });

  watch('./app/js/**/*.{js,tag}', function (vinyl) {
    console.log(`${vinyl.path} was ${vinyl.event}, running ES6-7 to ES5...`);
    runSequence('es6-7');
  });

  // Watch to reload

  watch('./views/**/*.html', function (vinyl) {
    console.log(`${vinyl.path} was ${vinyl.event}, reloading browsers...`);
    browserSync.reload();
  });
});

//  #########
//  # Build #
//  #########

gulp.task('assets', 'Copy assets to public directory', function () {
  return gulp.src('./app/assets/**/*', {
    base: './app/assets'
  })
    .pipe(plumber(errorHandler('assets')))
    .pipe(newer('./public'))
    .pipe(gulp.dest('./public'))
    .on('end', browserSync.reload);
});

gulp.task('vendor', 'Copy vendor to public directory', function (done) {
  return gulp.src('./app/vendor/**/*', {
    base: './app'
  })
    .pipe(plumber(errorHandler('vendor')))
    .pipe(newer('./public'))
    .pipe(gulp.dest('./public'))
    .on('end', browserSync.reload);
});

gulp.task('humans', 'Update humans.txt update date', function () {
  var date = new Date();
  var formattedDate = `${date.getFullYear()}/${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}`;
  return gulp.src(['./public/humans.txt'])
    .pipe(plumber(errorHandler('humans')))
    .pipe(replace('${lastUpdate}', formattedDate))
    .pipe(gulp.dest('./public'));
});

gulp.task('build:clean', 'Clean public directory for fresh public build', function (done) {
  del(['./public/**/*']).then(function () {
    done();
  });
});

gulp.task('build', 'Build public directory', function (done) {
  runSequence('build:clean', 'assets', 'vendor', ['stylus', 'es6-7', 'humans'], done);
});

gulp.task('dist:clean', 'Clean dist directory for fresh distribution build', function (done) {
  del(['./dist']).then(function () {
    done();
  });
});

gulp.task('dist:copy', 'Copy files to dist', function () {
  return gulp.src('./{server.js,package.json,public/**/*,views/**/*}', {
    base: './'
  })
    .pipe(plumber(errorHandler('dist:copy')))
    .pipe(gulp.dest('./dist'));
});

gulp.task('dist:imagemin', 'Minify images in build', function () {
  return gulp.src('./dist/public/img/**/*.{png,jpg,gif,svg}', {
    base: './dist'
  })
    .pipe(plumber(errorHandler('dist:imagemin')))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('dist:cachebust', 'Cache bust in build', function () {
  return gulp.src(['./dist/public/css/**/*.css', './dist/public/js/**/*.js'], { base: './dist' })
    .pipe(plumber(errorHandler('dist:cachebust')))
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist'));
});

gulp.task('dist:cachebust-replace', 'Replace cache busted references in build', function () {
  var stripPublic = function (filename) {
    return filename.replace('public', '');
  };

  var manifest = gulp.src('./dist/rev-manifest.json');

  return gulp.src('./dist/views/**/*.html', { base: './dist' })
    .pipe(plumber(errorHandler('dist:cachebust-replace')))
    .pipe(revReplace({ manifest: manifest, modifyUnreved: stripPublic, modifyReved: stripPublic }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('dist:cachebust-clean', 'Clean cache bust files in build', function (done) {
  del(['./dist/rev-manifest.json']).then(function () {
    done();
  });
});

gulp.task('dist', 'Dist project into a dist directory', function (done) {
  runSequence('build', 'dist:clean', 'dist:copy', 'dist:imagemin', 'dist:cachebust', 'dist:cachebust-replace', 'dist:cachebust-clean', function () {
    if (errored) {
      console.log('Build failed, cleaning dist directory');
      runSequence('dist:clean', function () {
        process.exit(-1);
      });
    }
    done();
  });
});
