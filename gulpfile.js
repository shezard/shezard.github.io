var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var inlineStyle = require('gulp-inline-style');

gulp.task('default', function() {
    return gulp.src('./src/index.html')
        .pipe(minifyHTML({
          empty: true
        }))
        .pipe(inlineStyle())
        .pipe(gulp.dest('./'));
});
