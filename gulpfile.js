'use strict';
const {
	src,
	dest,
	parallel,
	series,
	gulp
} = require('gulp');

const concat = require('gulp-concat');
const scss = require('gulp-sass');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const ngAnnotate = require('gulp-ng-annotate');

const sftp = require('gulp-sftp-up4');
const gulpif = require('gulp-if');
const minify = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const watch = require('gulp-watch');

var prodMode = false;
const ws = require('gulp-webserver');
const min = ".min";
var destt = 'builds/dev';
var add = '';

function libsjs() {

	return src([
			'node_modules/angular/angular' + add + '.js',
			'node_modules/angular-ui-router/release/angular-ui-router' + add + '.js',
			//'node_modules/angular-animate/angular-animate' + add + '.js',
			//'node_modules/angular-touch/angular-touch' + add + '.js',
			'node_modules/angular-ui-notification/dist/angular-ui-notification' + add + '.js',
			'node_modules/angular-translate/dist/angular-translate.min.js',
			'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
			'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
			//'node_modules/chart.js/dist/Chart' + add + '.js',
			//'node_modules/angular-chart.js/dist/angular-chart' + add + '.js'
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
		//.pipe(gulpif(prodMode, uglify()))
		.pipe(concat('app.js'))
		.pipe(dest(destt))
}

function css() {
	return src([
			'src/app/**/*.scss',
		])
		.pipe(plumber())
		.pipe(scss())
		//.pipe(autoprefixer())
		.pipe(gulpif(prodMode, minify()))
		.pipe(concat('app.css'))
		.pipe(dest(destt))
}

function move() {
	return src([
			'src/images*/*',
			'src/fonts*/*',
			'src/*.json'
		])
		.pipe(dest(destt))
}

function html() {
	return src([
			'src/*.html',
			'src/**/*.html'
		])
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(dest(destt))
}

function production(cb) {
	destt = 'builds/prod';
	add = min;
	prodMode = true;
	cb();
}

function webserver() {
	return src(destt)
		.pipe(ws({
			livereload: true,
			open: true
		}));
}



exports.libsjs = libsjs;
exports.libscss = libscss;
exports.webserver = webserver;

exports.js = js;
exports.css = css;
exports.html = html;
exports.move = move;

function watchFiles() {
	watch("./src/app/**/*.scss", css);
	watch("./src/app/**/*.js", js);
	watch(["./src/app/**/*.html", "./src/app/index.html"], html);
}

function prod(cb) {
	series(production, libsjs, libscss, js, css, html, move);
	cb();
}

function publish(cb) {
	console.log ('./' + destt + '/**/*.*');
	return src([
		'./' + destt + '/**/*.js',
		'./' + destt + '/**/*.css',
		'./' + destt + '/**/*.html',
	]).pipe(sftp({
			host: "192.168.0.163",
			port: 22,
			user: "root",
			pass: "root",
			remotePath: "/home/infotrans/web_ui/",
		}));

	cb();
}

exports.publish = series(production,publish);
exports.default = series(libsjs, libscss, js, css, html, move);
exports.prod = series(production, libsjs, libscss, js, css, html, move, publish);
exports.serve = series(libsjs, libscss, js, css, html, move, webserver, watchFiles);