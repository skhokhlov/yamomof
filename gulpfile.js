var gulp = require('gulp'),
    csso = require('gulp-csso'),
    shell = require('gulp-shell'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    htmlmin = require('gulp-htmlmin'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('css', function () {
    gulp.src('app/app.css')
        .pipe(stylus())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(csso())
        .pipe(gulp.dest('public'));
});

gulp.task('js', function () {
    //gulp.src(['app.js'])
    //    .pipe(jshint())
    //    .pipe(jshint.reporter('default'));

    gulp.src(['app/bootstrap.js', 'app/app.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('public'));

    gulp.src(['node_modules/yate/lib/runtime.js'])
        .pipe(gulp.dest('public'));

});

gulp.task('yate', function () {
    gulp.src(['app/app.yate'])
        .pipe(shell([
            './node_modules/.bin/yate <%= file.path %> > public/app.yate.js'
        ]));
});

gulp.task('default', ['yate', 'js', 'css']);
