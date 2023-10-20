/// <binding AfterBuild='Build' />
const { src, dest, watch, series, task, parallel } = require('gulp');
var gulp = require('gulp');
var concat = require('gulp-concat');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const prefix = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagewebp = require('gulp-webp');
const gzip = require('gulp-gzip');
const webpack = require('webpack');
const sourcemaps = require('gulp-sourcemaps');
const preprocess = require("gulp-preprocess");

function homeStyles() {
    return src('FrontEndDev/homestyles/home.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: "FrontEndDev/homestyles" }).on('error', sass.logError))
        .pipe(rename({ extname: ".css" }))
        .pipe(sourcemaps.write("."))
        .pipe(dest('wwwroot/css/home'));
};

function baseStyles() {
    return src('FrontEndDev/base.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: "FrontEndDev" }).on('error', sass.logError))
        .pipe(rename({ extname: ".css" }))
        .pipe(sourcemaps.write("."))
        .pipe(dest('wwwroot/css'));
};

function allStyles() {
    return src('FrontEndDev/allstyles/styles.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ includePaths: "FrontEndDev/allstyles" }).on('error', sass.logError))
        .pipe(rename({ extname: ".css" }))
        .pipe(sourcemaps.write("."))
        .pipe(dest('wwwroot/css/allstyles'))
}

// Individual Tasks that can be ran from Task Runner Explorer
task("Build",
    parallel(
        series(homeStyles, baseStyles, allStyles)
    )
);
