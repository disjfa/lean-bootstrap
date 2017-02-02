'use strict';

let gulp        = require('gulp');
let browserSync = require('browser-sync');
let nodemon     = require('gulp-nodemon');
let sass        = require('gulp-sass');
let browserify  = require('browserify');
let watchify    = require('watchify');
let babelify    = require('babelify');
let merge       = require('utils-merge');
let gutil       = require('gulp-util');
let chalk       = require('chalk');
let source      = require('vinyl-source-stream');
let buffer      = require('vinyl-buffer');
let rename      = require('gulp-rename');
let sourcemaps  = require('gulp-sourcemaps');
let vueify      = require('vueify');

gulp.task('default', ['browser-sync', 'watchify'], function () {
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
        proxy: "0.0.0.0:8000",
        files: ["public/**/*.*"],
        open: false,
        port: 7000,
        domain: '0.0.0.0',
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

gulp.task('watchify', function () {
    let args    = merge(watchify.args, {debug: true, extensions: ['js', 'vue']});
    let bundler = watchify(browserify('./src/js/index.js', args))
        .transform(vueify)
        .transform(babelify, {
            presets: ['es2015']
        });
    bundle_js(bundler);

    bundler.on('update', function () {
        bundle_js(bundler)
    })
});

function map_error(err) {
    if (err.fileName) {
        // regular error
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': '
            + 'Line '
            + chalk.magenta(err.lineNumber)
            + ' & '
            + 'Column '
            + chalk.magenta(err.columnNumber || err.column)
            + ': '
            + chalk.blue(err.description))
    } else {
        // browserify error..
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message))
    }
}

function bundle_js(bundler) {
    return bundler.bundle()
        .on('error', map_error)
        .pipe(source('src/js/index.js'))
        .pipe(buffer())
        .pipe(rename('index.js'))
        .pipe(sourcemaps.init({loadMaps: true}))
        // capture sourcemaps from transforms
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'))
}
