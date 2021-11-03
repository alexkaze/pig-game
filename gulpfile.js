const { src, dest, watch, parallel, series } = require('gulp');

const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-image');
const del = require('del');

function browsersync() {
  browserSync.init({
    server: { baseDir: 'app/' },
  });
}

function cleanDist() {
  return del('dist');
}

function watching() {
  watch('app/**/*.html').on('change', browserSync.reload);
  watch(['app/scss/**/*.scss', 'app/scss/**/*.sass'], styles);
  watch(['app/js/**/*.js', '!app/js/**/*.min.js'], scripts);
}

function styles() {
  return src(['app/scss/**/*.sass', 'app/scss/**/*.scss'])
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(concat('style.min.css'))
    .pipe(
      autoprefixer({ overrideBrowserslist: ['last 10 version'], grid: true })
    )
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(['app/js/main.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream());
}

function images() {
  return src('app/images/**/*')
    .pipe(
      imagemin({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        gifsicle: true,
        svgo: true,
        concurrent: 10,
        quiet: true,
      })
    )
    .pipe(dest('dist/images'));
}

function build() {
  return src(
    [
      'app/css/style.min.css',
      'app/fonts/**/*',
      'app/js/main.min.js',
      'app/*.html',
    ],
    { base: 'app' }
  ).pipe(dest('dist'));
}

exports.browsersync = browsersync;
exports.watching = watching;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;

exports.build = series(cleanDist, images, build);
exports.default = parallel(browsersync, watching, styles, scripts);
