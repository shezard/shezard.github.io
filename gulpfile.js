var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');
var inlineStyle = require('gulp-inline-style');
var minifyInline = require('gulp-minify-inline');

gulp.task('default', ['home', 'projects'])

gulp.task('home', function() {
    return gulp.src('./src/index.html')
        .pipe(minifyHTML({
          empty: true
        }))
        .pipe(inlineStyle('./'))
        .pipe(minifyInline())
        .pipe(gulp.dest('./'));
});

gulp.task('projects', function() {
    return gulp.src('./src/projects/index.html')
        .pipe(minifyHTML({
          empty: true
        }))
        .pipe(inlineStyle('./src/css'))
        .pipe(minifyInline())
        .pipe(gulp.dest('./projects/'));
});
