const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const merge = require('utils-merge');
const gutil = require('gulp-util');
const chalk = require('chalk');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const vueify = require('vueify');
const favicons = require('gulp-favicons');

gulp.task('default', ['copy', 'styles', 'browser-sync', 'watchify'], () => {
  gulp.watch('src/scss/**/*.scss', ['styles']);
});

gulp.task('build', ['styles', 'watchify'], () => {
  gulp.watch('src/scss/**/*.scss', ['styles']);
});

gulp.task('styles', () => {
  gulp.src('src/scss/index.scss')
    .pipe(sass({
      includePaths: ['./node_modules/'],
    }).on('error', sass.logError))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.init(null, {
    proxy: '0.0.0.0:8000',
    files: ['public/**/*.*'],
    open: false,
    port: 7000,
    domain: '0.0.0.0',
  });
});

gulp.task('nodemon', (cb) => {
  let started = false;

  return nodemon({
    script: './server.js',
  }).on('start', () => {
    if (started === false) {
      cb();
      started = true;
    }
  });
});

gulp.task('copy', () => {
  gulp.src('./node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('favicons', () => gulp.src('assets/icon.png').pipe(favicons({
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
    android: true,
    appleIcon: true,
    appleStartup: true,
    favicons: true,
    firefox: true,
    windows: true,
    yandex: true,
  },

}))
  .on('error', gutil.log)
  .pipe(gulp.dest('./public/icons')));

gulp.task('watchify', () => {
  const args = merge(watchify.args, { debug: true, extensions: ['js', 'vue'] });
  const bundler = watchify(browserify('./src/js/index.js', args))
    .transform(vueify)
    .transform(babelify, {
      presets: ['stage-2', 'es2015'],
    });
  bundle_js(bundler);

  bundler.on('update', () => {
    bundle_js(bundler);
  });
});

function map_error(err) {
  if (err.fileName) {
    // regular error
    gutil.log(`${chalk.red(err.name)}: ${chalk.yellow(err.fileName.replace(`${__dirname}/src/js/`, ''))}: ` + `Line ${chalk.magenta(err.lineNumber)} & ` + `Column ${chalk.magenta(err.columnNumber || err.column)}: ${chalk.blue(err.description)}`);
  } else {
    // browserify error..
    gutil.log(`${chalk.red(err.name)}: ${chalk.yellow(err.message)}`);
  }
}

function bundle_js(bundler) {
  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('src/js/index.js'))
    .pipe(buffer())
    .pipe(rename('index.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    // capture sourcemaps from transforms
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js'));
}
