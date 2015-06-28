var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');

gulp.task('minify-html', function() {
  var opts = {
    empty: true
  };

  return gulp.src('./index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('./dist/'));
});
