'use strict';
const {
	src,
	dest,
	parallel,
	series
} = require('gulp'),
	concat = require('gulp-concat'),
	scss = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	ngAnnotate = require('gulp-ng-annotate'),
	//ngmin = require('gulp-ngmin'),
	autoprefixer = require('gulp-autoprefixer');

const gulpif = require('gulp-if');
const minify = require('gulp-clean-css');

var prodMode = false;
const ws = require('gulp-webserver-io');
const min = ".min";
var destt = 'builds/dev';
var add = '';

function libsjs() {

	return src([
			'node_modules/angular/angular' + add + '.js',
			'node_modules/angular-ui-router/release/angular-ui-router' + add + '.js',
			'node_modules/angular-animate/angular-animate' + add + '.js',
			'node_modules/angular-touch/angular-touch' + add + '.js',
			'node_modules/angular-ui-notification/dist/angular-ui-notification' + add + '.js',
			'node_modules/angular-translate/dist/angular-translate.min.js',
			'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
			'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
			'node_modules/chart.js/dist/Chart' + add + '.js',
			'node_modules/angular-chart.js/dist/angular-chart' + add + '.js'
		])
		.pipe(concat('libs.js'))
		.pipe(dest(destt))
}

function libscss() {
	return src([
			'node_modules/bootstrap/dist/css/bootstrap' + add + '.css',
			'node_modules/angular/angular-csp.css',
			'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
			'node_modules/angular-ui-notification/dist/angular-ui-notification' + add + '.css'
		])
		.pipe(concat('libs.css'))
		.pipe(dest(destt))
}

function js() {
	return src([
			'src/app/**/*.js',
		])
		.pipe(ngAnnotate())
		.pipe(plumber())
		.pipe(gulpif(prodMode, uglify()))
		.pipe(concat('app.js'))
		.pipe(dest(destt))
}

function css() {
	return src([
			'src/app/**/*.scss',
		])
		.pipe(plumber())
		.pipe(scss())
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false
		}))
		.pipe(gulpif(prodMode, minify()))
		.pipe(concat('app.css'))
		.pipe(dest(destt))
}

function html() {
	return src([
			'src/*.html',
			'src/**/*.html',
			'src/images*/*',
			'src/fonts*/*',
			'src/*.json'
		])
		.pipe(dest(destt))
}

function production(cb) {
	destt = 'builds/prod';
	add = min;
	prodMode = true;
	cb();
}

function webserver() {
	return src('builds/dev')
		.pipe(ws({
			livereload: false,
			directoryListing: false,
			open: true,
			ioDebugger: true // enable the ioDebugger  
		}))
}

exports.libsjs = libsjs;
exports.libscss = libscss;
exports.webserver = webserver;

exports.js = js;
exports.css = css;
exports.html = html;

exports.default = series(libsjs, libscss, js, css, html);
exports.prod = series(production, libsjs, libscss, js, css, html);