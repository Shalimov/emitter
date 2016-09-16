var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
// var sourcemaps = require('gulp-sourcemaps');
var strip = require('gulp-strip-comments');

gulp.task('default', function () {
  gulp.src('src/*.js')
    .pipe(strip())
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('event-emitter.min.js'))
    .pipe(gulp.dest('dist'));
});
