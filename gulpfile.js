'use strict';

var prodMode = false;

const {src, dest, parallel, series } = require('gulp'),
	concat = require('gulp-concat'),
	scss = require('gulp-sass'),
	//uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	ngAnnotate = require('gulp-ng-annotate'),
	//ngmin = require('gulp-ngmin'),
	autoprefixer = require('gulp-autoprefixer');
	//minify = require('gulp-clean-css');

function libsjs(){
	return src([
		'node_modules/angular/angular.js',
		'node_modules/angular-ui-router/release/angular-ui-router.js',
		'node_modules/angular-animate/angular-animate.js',
		'node_modules/angular-touch/angular-touch.js',
		'node_modules/angular-ui-notification/dist/angular-ui-notification.js',
		'node_modules/angular-translate/dist/angular-translate.min.js',
		'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
		'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
		'node_modules/chart.js/dist/Chart.js',
		'node_modules/angular-chart.js/dist/angular-chart.js'
	])
	.pipe(concat('libs.js'))
	.pipe(dest('builds/dev'))
}

function libscss(){
	return src([
		'node_modules/bootstrap/dist/css/bootstrap.css',
		'node_modules/angular/angular-csp.css',
		'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
		'node_modules/angular-ui-notification/dist/angular-ui-notification.css'
	])
	.pipe(concat('libs.css'))
	.pipe(dest('builds/dev'))
}

function js(){
	return src([
		'src/app/**/*.js',
	])
	.pipe(plumber())
	.pipe(concat('app.js'))
	.pipe(ngAnnotate())
	.pipe(dest('builds/dev', { sourcemaps: true }))
}

function css(prodMode){
	return src([
		'src/app/**/*.scss',
	])
	.pipe(plumber())
	.pipe(scss())
	.pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
	}))
	.pipe(concat('app.css'))
	.pipe(dest('builds/dev'))
}

function html(){
	return src([
		'src/*.html',
		'src/**/*.html',
		'src/images*/*',
		'src/fonts*/*',
		'src/*.json'
	])
	.pipe(dest('builds/dev'))
}

function production(cb){
	
	prodMode = true;
	cb();
}

exports.libsjs = libsjs;
exports.libscss = libscss;
exports.production = production;

exports.js = js;
exports.css = css;
exports.html = html;

exports.default = parallel(libsjs, libscss, js, css, html);
exports.prod = series(production, parallel(libsjs, libscss, js, css, html));