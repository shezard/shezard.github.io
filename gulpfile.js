const gulp = require('gulp');
const minifyHTML = require('gulp-minify-html');
const inlineStyle = require('gulp-inline-style');
const minifyInline = require('gulp-minify-inline');

gulp.task('home', function() {
    return gulp.src('./src/index.html')
        .pipe(minifyHTML({
          empty: true
        }))
        .pipe(inlineStyle('./'))
        .pipe(minifyInline())
        .pipe(gulp.dest('./docs'));
});

gulp.task('projects', function() {
    return gulp.src('./src/projects/index.html')
        .pipe(minifyHTML({
          empty: true
        }))
        .pipe(inlineStyle('./src/css'))
        .pipe(minifyInline())
        .pipe(gulp.dest('./docs/projects/'));
});

gulp.task('copy-cv', function() {
  return gulp.src('./src/cv/*.pdf')
    .pipe(gulp.dest('./docs/cv'));
});

gulp.task('copy-projects', function() {
  return gulp.src('./src/projects/**/*')
    .pipe(gulp.dest('./docs/projects'));
});

gulp.task('default', gulp.series(['home', 'copy-projects', 'projects', 'copy-cv']));