const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleancss = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const del = require('del');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
// npm install --save-dev gulp-babel @babel/core @babel/preset-env @babel/plugin-transform-arrow-functions
// const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const mergeStream = require('merge-stream');


const path = {
    src: {
        html: './app/*.html',
        mainCss: './app/scss/main_style.scss',
        pagesCss: './app/scss/pages/*.scss',
        js: './app/js/*.js',
        img: './app/img/**/*.*',
        fonts: './app/fonts/**/*.*',
    },
    dist: {
        html: './dist/',
        mainCss: './dist/css/',
        pagesCss: './dist/css/pages/',
        js: './dist/js/',
        img: './dist/img/',
        fonts: './dist/fonts/',
    },
    watch: {
        html: './app/**/*.html',
        css: './app/scss/**/*.scss',
        js: './app/js/**/*.js',
        img: './app/img/**/*.*',
        fonts: './app/fonts/**/*.*',
    }
};


const clean = () => {
    return del('dist');
};

const htmlBuild = () => {
    return gulp
        .src(path.src.html)
        .pipe(gulp.dest(path.dist.html));
};

const cssBuild = () => {
    return mergeStream(
        gulp
            .src(path.src.mainCss)
            .pipe(plumber())
            .pipe(
                sass({
                    outputStyle: 'compressed',
                }).on('error', notify.onError())
            )
            .pipe(postcss(
                [autoprefixer([
                    'last 15 versions'
                ])]
            ))
            .pipe(cleancss({level: {1: {specialComments: 0}}}))
            .pipe(rename('style.min.css'))
            .pipe(gulp.dest(path.dist.mainCss)),

        gulp
            .src(path.src.pagesCss)
            .pipe(plumber())
            .pipe(
                sass({
                    outputStyle: 'compressed',
                }).on('error', notify.onError())
            )
            .pipe(postcss(
                [autoprefixer([
                    'last 15 versions'
                ])]
            ))
            .pipe(cleancss({level: {1: {specialComments: 0}}}))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(path.dist.pagesCss))
    );   
};

const jsBuild = () => {
    return gulp
        .src(path.src.js)
        .pipe(plumber())
        .pipe(uglify())
        .pipe(concat('script.min.js'))
        .pipe(gulp.dest(path.dist.js));
};

const imgBuild = () => {
    return gulp
        .src(path.src.img)
        .pipe(gulp.dest(path.dist.img));
};

const fontsBuild = () => {
    return gulp
        .src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts));
};

const watchFiles = () => {
    gulp.watch(path.watch.html, htmlBuild);
    gulp.watch(path.watch.css, cssBuild);
    gulp.watch(path.watch.js, jsBuild);
    gulp.watch(path.watch.img, imgBuild);
    gulp.watch(path.watch.fonts, fontsBuild);
};

// define complex tasks
const build = gulp.series(clean, gulp.parallel(htmlBuild, cssBuild, jsBuild, imgBuild, fontsBuild));
const watch = gulp.parallel(watchFiles);
const dev = gulp.series(build, watch);

exports.build = build;
exports.watch = watch;
exports.dev = dev;
exports.default = dev;
