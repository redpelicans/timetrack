var gulp = require('gulp');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var babel = require('gulp-babel');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var path = require('path');
const SRV_SRC = 'server/src';

var serverPaths = {
  src: SRV_SRC + '/**/*.js',
  dist:'server/lib',
  sourceRoot: path.join(__dirname, 'server/src'),
};


// need this options to use decorators
var compilerOptions = {
  stage: 0,
  optional: [
    "es7.decorators",
    "regenerator",
    "asyncToGenerator",
    "es7.classProperties",
    "es7.asyncFunctions"
  ]
};

gulp.task('build-server', function () {
  // tanspile from src to dist
  var build =  gulp.src(serverPaths.src)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(changed(serverPaths.dist, {extension: '.js'}))
    .pipe(babel(compilerOptions))
    .pipe(sourcemaps.write('.', { sourceRoot: serverPaths.sourceRoot}))
    .pipe(gulp.dest(serverPaths.dist));

  // package.json is read by main.js, so we need it at root level: /server/lib
  var copy = gulp.src('package.json')
    .pipe(gulp.dest(serverPaths.dist));

  return merge.apply(null, [copy, build]);
});


function reportChange(event){
  console.log('File ' + event.path + ' has been ' + event.type );
}

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-server', 'run-client'],
    callback
  );
});

gulp.task('clean', function() {
 return gulp.src([serverPaths.dist])
    .pipe(vinylPaths(del));
});

gulp.task('run-client', function (cb) {
  var called = false;
  return nodemon({
      script: './proxy.js'
    , quiet: true
    , "no-stdin": true
    , env: {
      'DEBUG': 'timetrack:*',
      'PORT': '3004'
    }
  })
  .on('start', function () {
    if(!called)cb();
    called = true;
  })
  //.on('restart', function (files) { console.log('server restarted ...') })
});



// watch (nodemon) changes within /server/lib and reload node
gulp.task('nodemon', ['build'], function (cb) {
  var called = false;
  return nodemon({
      script: path.join(serverPaths.dist, '/main.js')
    , ext: 'js json'
    , verbose: true
    , watch: [ serverPaths.dist, './params.js' ]
    , ignore: ['*.swp',  "*.map" ]
    , env: {
      'DEBUG': 'timetrack:*'
    }
  })
  .on('start', function () {
    if(!called)cb();
    called = true;
  })
  //.on('restart', function (files) { console.log('server restarted ...') })
});

gulp.task('watch',  ['nodemon'], function() { 
  gulp.watch(serverPaths.src, ['build-server']).on('change', reportChange);
});

gulp.task('default', ['watch']);

