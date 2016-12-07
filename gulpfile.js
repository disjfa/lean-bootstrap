'use strict';

let gulp        = require('gulp');
let browserSync = require('browser-sync');
let nodemon     = require('gulp-nodemon');
let sass        = require('gulp-sass');

gulp.task('default', ['browser-sync'], function () {
    gulp.watch('src/scss/**/*.scss', ['styles']);
});

gulp.task('styles', function () {
    gulp.src('src/scss/index.scss')
        .pipe(sass({
            includePaths: ['./node_modules/']
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('browser-sync', ['nodemon'], function () {
    browserSync.init(null, {
        proxy: "http://0.0.0.0:3000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
});

gulp.task('nodemon', function (cb) {
    let started = false;

    return nodemon({
        script: './server.js'
    }).on('start', function () {
        if (false === started) {
            cb();
            started = true;
        }
    });
});