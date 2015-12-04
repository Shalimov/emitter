var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulp = require('gulp');

gulp.task('default', function () {
  gulp.src('src/*.js')
    .pipe(gulp.dest('dist'));

  gulp.start('ugly');
});

gulp.task('ugly', function () {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename('event-emitter.min.js'))
    .pipe(gulp.dest('dist'));
});