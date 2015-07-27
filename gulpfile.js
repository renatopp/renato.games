var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var less        = require('gulp-less');
var minify      = require('gulp-minify-css');
var exec        = require('child_process').exec;
var browserSync = require('browser-sync');
var reload      = browserSync.reload;


// ============================================================================
// INTERNAL
// ============================================================================

/**
 * Concatenate and uglify vendor javascript.
 */
gulp.task('_vendor_js', function() {
  var js_sources = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootflatv2/js/bootstrap.min.js',
    'bower_components/bootflatv2/bootflat/js/icheck.min.js',
    'bower_components/bootflatv2/bootflat/js/jquery.fs.selecter.min.js',
    'bower_components/bootflatv2/bootflat/js/jquery.fs.stepper.min.js',
    'bower_components/magnific-popup/dist/jquery.magnific-popup.min.js',
  ];

  return gulp.src(js_sources)
             .pipe(uglify())
             .pipe(concat('vendor.min.js'))
             .pipe(gulp.dest('renatopp/static/js'))
}) 

/**
 * Concatenate and uglify vendor css.
 */
gulp.task('_vendor_css', function() {
  var css_sources = [
    'bower_components/bootflatv2/css/bootstrap.min.css',
    'bower_components/bootflatv2/bootflat/css/bootflat.min.css',
    'bower_components/fontawesome/css/font-awesome.min.css',
    'bower_components/magnific-popup/dist/magnific-popup.css',
  ];

  return gulp.src(css_sources)
             .pipe(minify())
             .pipe(concat('vendor.min.css'))
             .pipe(gulp.dest('renatopp/static/css'))
}) 

/**
 * Copy vendor fonts.
 */
gulp.task('_vendor_fonts', function() {
  var fonts_sources = [
    'bower_components/fontawesome/fonts/*'
  ];

  return gulp.src(fonts_sources)
             .pipe(gulp.dest('renatopp/static/fonts'))
}) 

/**
 * Concatenate and uglify vendor libraries, and copy static files from vendors.
 */
gulp.task('_vendor', ['_vendor_js', '_vendor_css', '_vendor_fonts']);

/**
 * Compile less
 */
gulp.task('_less', function() {
  return gulp.src('renatopp/static/less/index.less')
             .pipe(less())
             .pipe(minify())
             .pipe(concat('style.min.css'))
             .pipe(gulp.dest('renatopp/static/css'))
});

/**
 * Watch for development.
 */
gulp.task('_watch', function() {
  var watching = [
    'renatopp/static/less/**/*.less',
    'renatopp/templates/**/*.jinja',
  ]
  
  browserSync({
    notify: false,
    proxy: "127.0.0.1:5000"
  });

  gulp.watch(watching, ['_less', reload]);
});


// ============================================================================
// PUBLIC
// ============================================================================

gulp.task('dev', ['_vendor', '_less', '_watch'])
gulp.task('deploy', function() {})