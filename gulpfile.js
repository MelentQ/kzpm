const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');
const cssMinify = require('gulp-csso');
const del = require('del');
const newer = require('gulp-newer');
const svgSprite = require('gulp-svg-sprite');
const debug = require('gulp-debug');
const webpack = require('webpack');
const webpackstream = require('webpack-stream');
const data = require('gulp-data');
const hb = require('gulp-hb');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const prettyHtml = require('gulp-pretty-html');
const fs = require('fs');
const path = require('path');
const webpackconfig = require('./webpack.config.js');

gulp.task('sprite', () => gulp
  .src('src/img/icons/*.svg')
  .pipe(plumber())
  .pipe(
    svgSprite({
      mode: {
        inline: true,
        symbol: {
          sprite: '../sprite.hbs',
        },
      },
    }),
  )
  .pipe(gulp.dest('./src/partials/components')));

gulp.task('handlebars', () => gulp
  .src('./src/pages/**/*.hbs')
  .pipe(debug({ title: 'handlebars compiler:' }))
  .pipe(
    data((file) => {
      try {
        const data = JSON.parse(fs.readFileSync(`./src/pages/data/${path.basename(file.path).replace('.hbs', '.json')}`));
        return data;
      } catch (err) {
        return null;
      }
    }),
  )
  .pipe(
    hb()
      .partials('./src/partials/components/**/*.hbs')
      .partials('./src/partials/layouts/**/*.hbs')
      .helpers(require('handlebars-layouts')),
  )
  .pipe(
    rename((path) => {
      path.extname = '.html';
    }),
  )
  .pipe(gulp.dest('build'))
  .pipe(browserSync.stream()));

gulp.task('styles', () => gulp
  .src('src/scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(autoprefixer())
  .pipe(cssMinify())
  .pipe(gulp.dest('build/css'))

  .pipe(browserSync.stream()));

gulp.task('scripts', () => gulp
  .src('./src/js/**/*')
  .pipe(plumber())
  .pipe(webpackstream(webpackconfig, webpack))
  .pipe(gulp.dest('./build/js/'))
  .pipe(browserSync.stream()));

gulp.task('scripts-production', () => gulp
  .src('./src/js/**/*')
  .pipe(plumber())
  .pipe(webpackstream({ ...webpackconfig, mode: 'production', devtool: 'source-map' }, webpack))
  .pipe(gulp.dest('./build/js/'))
  .pipe(browserSync.stream()));

gulp.task('clean', () => del('./build'));

gulp.task('serve', () => {
  browserSync.init({
    server: 'build/',
    port: 7000,
    ghostMode: false,
  });
  gulp.watch(['./src/**/*.hbs', './src/pages/data**/*.json'], gulp.series('handlebars'));

  gulp.watch('./src/img/icons/*svg', gulp.series('sprite', 'handlebars'));

  gulp.watch('./src/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('./src/js/**/*.js', gulp.series('scripts'));
  gulp.watch('./src/img/**/*', gulp.series('images'));
  gulp.watch('./src/assets/**/*', gulp.series('assets'));
});

gulp.task('images', () => gulp
  .src('./src/img/**/*')
  .pipe(gulp.dest('./build/img'))
  .pipe(browserSync.stream()));

gulp.task('assets', () => gulp
  .src('./src/assets/**/*')
  .pipe(newer('./build/assets'))
  .pipe(gulp.dest('./build/assets'))
  .pipe(browserSync.stream()));

gulp.task('beautify-html', () => gulp.src('./build/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    removeComments: true,
  }))
  .pipe(prettyHtml({
    indent_size: 4,
    indent_char: ' ',
    indent_inner_html: true,
    unformatted: [],
    content_unformatted: [],
    wrap_line_length: 0,
    inline: [],
    extra_liners: ['header', 'main', 'footer', '/body'],
  }))
  .pipe(gulp.dest('./build')));

gulp.task('build', gulp.series('clean', 'images', 'sprite', 'handlebars', gulp.parallel('assets', 'styles', 'scripts')));

gulp.task('build-production', gulp.series('clean', 'images', 'sprite', 'handlebars', 'beautify-html', gulp.parallel('assets', 'styles', 'scripts-production')));

gulp.task('default', gulp.series('build', 'serve'));
