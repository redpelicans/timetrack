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

// need this options to use decorators
var compilerOptions = {
    // stage: 0,
    // optional: [
    //   "es7.decorators",
    //   "regenerator",
    //   "asyncToGenerator",
    //   "es7.classProperties",
    //   "es7.asyncFunctions"
    // ]
//  presets: ['react', 'es2015'],
};

gulp.task('transpile', function () {
  // tanspile from src to dist
  var build =  gulp.src('./src/**')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(changed('./dist/', {extension: '.js'}))
    .pipe(babel(compilerOptions))
    .pipe(sourcemaps.write('.', { sourceRoot: './src'}))
    .pipe(gulp.dest('./dist/'));

  // package.json is read by main.js, so we need it at root level: /server/dist
  var copy = gulp.src('package.json')
    .pipe(gulp.dest('./dist'));

  return merge.apply(null, [copy, build]);
});

function reportChange(event){
  console.log('=> File ' + event.path + ' has been ' + event.type );
}

gulp.task('clean-dist', function() {
 return gulp.src(['./dist'])
    .pipe(vinylPaths(del));
});

gulp.task('run-server', function (cb) {
  var started = false;
  nodemon({
      script: './proxy.js'
    , verbose: true
    , ext: 'js ejs json'
    //, watch: [ './dist/server/', './views/']
    , ignore: ['*.swp',  "*.js.map", './src/client/' ]
    , env: { DEBUG: 'timetrack:*' }
  })
  //.on('restart', function(files){ console.log("node restarted")})
  .on('start', function() { 
    console.log('node started') 
    if(!started){
      started = true;
      cb();
    }
  })
});

gulp.task('watch-server', ['transpile'], function() { 
  gulp.watch('./src/server/**', ['transpile']).on('change', reportChange);
});

gulp.task('watch-client', function() { 
  gulp.watch('./src/client/**').on('change', reportChange);
});

gulp.task('run', ['watch-server', 'watch-client'], function(cb){
  return runSequence( 'run-server', cb )
});

gulp.task('default', ['run']);
