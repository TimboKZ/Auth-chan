var gulp = require('gulp');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
gulp.task('sass', function () {
    return gulp.src('src/sass/auth-chan.sass')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('assets/css'))
        .pipe(cleanCSS())
        .pipe(rename('auth-chan.min.css'))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

var ts = require('gulp-typescript');
gulp.task('ts', function () {
    return gulp.src('src/ts/auth-chan.ts')
        .pipe(ts())
        .pipe(gulp.dest('assets/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

var browserSync = require('browser-sync').create();
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
});

gulp.task('default', ['browserSync', 'sass', 'ts'], function () {
    gulp.watch('src/sass/auth-chan.sass', ['sass']);
    gulp.watch('src/ts/auth-chan.ts', ['ts']);
    gulp.watch('index.html', browserSync.reload);
});