var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),

	livereload = require('gulp-livereload'),

	webserver = require('gulp-webserver'),

	path = require('path'),
	csso = require('gulp-csso')
	rename = require('gulp-rename')

	modernizr = require('gulp-modernizr');

gulp.task('css', function() {
	return sass('./stylesheets/*.scss', {
			style: 'compressed',
			loadPath: [
				"./stylesheets", 
				"./bower_components/bootstrap-sass/assets/stylesheets",
				"./bower_components/font-awesome/scss"
			]
		})
		.pipe( concat('all.min.css'))
		.pipe( csso() )
		.pipe( gulp.dest('./dist/stylesheets') )
		.pipe(livereload());
});

gulp.task('js', function() {
	return gulp.src('./scripts/*.js')
		.pipe( uglify() )
		.pipe( concat('all.min.js') )
		.pipe( gulp.dest('./dist/scripts') )
		.pipe(livereload());

});

gulp.task('images', function() {
	gulp.src('./images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/images'));
});

gulp.task('statics', function() {
	return gulp.src('./*.html')
		.pipe( gulp.dest('./dist'))
		.pipe(livereload());
});

gulp.task('bower_components', function() {
	gulp.src('./bower_components/bootstrap-sass/assets/fonts/**/*.*')
		.pipe(gulp.dest('./dist/bower_components/fonts'));
});

gulp.task('font-awesome', function() {
	gulp.src('./bower_components/font-awesome/fonts/**/*.*')
		.pipe(gulp.dest('./dist/bower_components/font-awesome/fonts'));
});

gulp.task('components', ['bower_components', 'font-awesome']);

gulp.task('webserver', function() {
	gulp.src('./dist')
		.pipe(webserver({
			fallback: 'index.html',
			open: true,
			port: 1337
		}));
});

gulp.task('modernizr', function() {
	gulp.src('./scripts/*.js')
		.pipe(modernizr())
		.pipe(gulp.dest("dist/scripts"));
});

gulp.task('watch', function () {
	livereload.listen();

	gulp.watch('./stylesheets/*.scss',['css']);

	gulp.watch('./scripts/*.js',['js']);

	gulp.watch('./*.html',['statics']);

	gulp.watch('./images/*',['images']);
});

// Default Task
gulp.task('default', ['js','css', 'images', 'modernizr', 'statics','webserver','watch']);

gulp.task('build', ['js','css', 'images', 'modernizr', 'statics', 'components']);