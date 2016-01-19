var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var jade        = require('gulp-jade');
var sass        = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var scssLint    = require('gulp-scss-lint');
var plumber     = require('gulp-plumber');
var notify      = require("gulp-notify");
var gutil       = require('gulp-util');
var clean       = require('gulp-clean');
// var watch       = require('gulp-watch'); // Snappy watch?

// Jade templates will compile at the beginning
gulp.task('default', ['serve', 'sass-compile', 'jade-compile']);

// Static server
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
  // Watching the jade files. Compiling when templates change.
  gulp.watch("./lib/templates/**/*.jade", ['jade-compile']);

  // Watching the HTML files. Reloading when templates change.
  gulp.watch("./dist/*.html").on("change", reload);

  // Watching the sass files. When changes, we don't reload, just compile.
  gulp.watch("./lib/sass/**/*.scss", ['sass-compile']);

  // Watching the scripts.
  gulp.watch("./dist/javascripts/*.js", reload);
});

// Compile jade files
gulp.task('jade-compile', function() {
  // var YOUR_LOCALS = {};
  return gulp.src(['./lib/templates/*.jade'])
    .pipe(plumber())
    .pipe(jade({
      // locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'));
});

function errorAlert(error){
  notify.onError({  title: "SCSS Error",
                    message: "Check your terminal: <%= error.message %>",
                    sound: "Sosumi"})(error); //Error Notification
  gutil.log(error.toString());
  this.emit("end"); // End function
}

// gulp.task('lint-scripts', function () {
//   return gulp.src('dist/stylesheets/main.css')
//     .pipe(clean());
// });

// Compile only main.scss into CSS
gulp.task('sass-compile', function() {
  return gulp.src("lib/sass/main.scss")
    .pipe(plumber({ errorHandler: errorAlert }))
    .pipe(scssLint({
      'config': 'sass-lint-config.yml'
    }))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: [ '> 1%',
                  'last 2 versions',
                  'firefox >= 4',
                  'safari 7',
                  'safari 8',
                  'IE 8',
                  'IE 9',
                  'IE 10',
                  'IE 11'],
      cascade: false
    }))
    .pipe(gulp.dest("dist/stylesheets"))
    .pipe(notify("CSS written!"))
    .pipe(browserSync.stream()); // Push into the stream, without reloading.
});
