var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var inlineCss = require('gulp-inline-css');

gulp.task('default', function() {
    return gulp.src('./src/index.html')
        .pipe(minifyHTML({
          empty: true
        }))
        .pipe(inlineCss())
        .pipe(gulp.dest('./'));
});
