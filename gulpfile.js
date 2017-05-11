'use strict'

let gulp = require('gulp')
let browserSync = require('browser-sync')
let nodemon = require('gulp-nodemon')
let sass = require('gulp-sass')
let browserify = require('browserify')
let watchify = require('watchify')
let babelify = require('babelify')
let merge = require('utils-merge')
let gutil = require('gulp-util')
let chalk = require('chalk')
let source = require('vinyl-source-stream')
let buffer = require('vinyl-buffer')
let rename = require('gulp-rename')
let sourcemaps = require('gulp-sourcemaps')
let vueify = require('vueify')
let favicons = require('gulp-favicons')

gulp.task('default', ['copy', 'browser-sync', 'watchify'], function () {
  gulp.watch('src/scss/**/*.scss', ['styles'])
})

gulp.task('styles', function () {
  gulp.src('src/scss/index.scss')
    .pipe(sass({
      includePaths: ['./node_modules/']
    }).on('error', sass.logError))
    .pipe(gulp.dest('./public/css/'))
})

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init(null, {
    proxy: '0.0.0.0:8000',
    files: ['public/**/*.*'],
    open: false,
    port: 7000,
    domain: '0.0.0.0',
  })
})

gulp.task('nodemon', function (cb) {
  let started = false

  return nodemon({
    script: './server.js'
  }).on('start', function () {
    if (false === started) {
      cb()
      started = true
    }
  })
})

gulp.task('copy', function () {
  gulp.src('./node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('./public/fonts'))
})

gulp.task('favicons', function () {
  return gulp.src('assets/icon.png').pipe(favicons({
    appName: 'Bootstrap playground',
    appDescription: 'Test and build bootstrap variables',
    developerName: 'disjfa',
    developerURL: 'http://disjfa.nl/',
    background: '#16a085',
    path: '/icons/',
    url: 'https://lean.dimme.nl/',
    display: 'standalone',
    orientation: 'portrait',
    start_url: '/?homescreen=1',
    version: 1.0,
    logging: false,
    online: false,
    html: 'index.html',
    pipeHTML: true,
    replace: true,
    icons: {
      android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background, shadow }`
      appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background }`
      appleStartup: true,         // Create Apple startup images. `boolean` or `{ offset, background }`
      favicons: true,             // Create regular favicons. `boolean`
      firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset, background }`
      windows: true,              // Create Windows 8 tile icons. `boolean` or `{ background }`
      yandex: true                // Create Yandex browser icon. `boolean` or `{ background }`
    }

  }))
    .on('error', gutil.log)
    .pipe(gulp.dest('./public/icons'))

})

gulp.task('watchify', function () {
  let args = merge(watchify.args, { debug: true, extensions: ['js', 'vue'] })
  let bundler = watchify(browserify('./src/js/index.js', args))
    .transform(vueify)
    .transform(babelify, {
      presets: ['stage-2', 'es2015']
    })
  bundle_js(bundler)

  bundler.on('update', function () {
    bundle_js(bundler)
  })
})

function map_error (err) {
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

function bundle_js (bundler) {
  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('src/js/index.js'))
    .pipe(buffer())
    .pipe(rename('index.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    // capture sourcemaps from transforms
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'))
}
