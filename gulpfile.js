var gulp = require('gulp');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var babel = require('gulp-babel');
var Cache = require('gulp-file-cache')
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var nodemon = require('gulp-nodemon');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var path = require('path');
var spawn = require('child_process').spawn;

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

var cache = new Cache();

gulp.task('transpile', function () {
  // tanspile from src to dist
  var build =  gulp.src('./src/**')
    //.pipe(cache.filter()) // remember files
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(changed('./dist/', {extension: '.js'}))
    .pipe(babel(compilerOptions))
    .pipe(sourcemaps.write('.', { sourceRoot: './src'}))
    //.pipe(cache.cache()) // cache them
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

gulp.task('watch-client', function() { 
  gulp.watch('./src/client/**').on('change', reportChange);
});

gulp.task('run-proxy', ['watch-server', 'watch-client'], function() {
   function runit(){
    var env = Object.create( process.env );
    env.DEBUG = 'timetrack:*';
    return spawn(
      'node', 
      ['./proxy.js'], 
      { 
        stdio: 'inherit', 
        env: env
      }
    )
   }
   var proc = runit();
   var watcher = gulp.watch(['./proxy.js', 'webpack.config.js']);
   watcher.on('change', function(event){
      reportChange(event);
      proc.kill();
      proc = runit();
   });
});

gulp.task('watch-server', ['transpile'], function () {
  var stream = nodemon({
                 script: './dist/server/main.js' 
               , watch: './src/server' 
               , tasks: ['transpile'] 
               , env: { 'DEBUG': 'timetrack:*' }
               })
  return stream
})


gulp.task('run', ['watch-server', 'run-proxy']);

gulp.task('default', ['run']);
