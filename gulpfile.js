var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = ['components/scripts/tagline.js',
                'components/scripts/rclick.js',
			    'components/scripts/pixgrid.js', 
			    'components/scripts/template.js'];
var sassSources = ['components/sass/style.scss'];
var htmlSources = ['builds/development/*.html'];
var jsonSources = ['builds/development/js/*.json'];

// process coffee script
gulp.task('coffee', function() {
    gulp.src(coffeeSources)
        .pipe(
            coffee({
                bare: true
            })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('components/scripts'));
});

// process js scripts
gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(
			concat('script.js')
		)
        .pipe(
            browserify()
        )
		.pipe(
			gulp.dest('builds/development/js/')
		)
        .pipe(
            connect.reload()
        );
});

// process sass files
gulp.task('compass',function() {
    gulp.src(sassSources)
        .pipe(
            compass({
                sass: 'components/sass/',
                image: 'builds/development/images/',
                style: 'expanded'
            })
            .on('error', gutil.log)
        )
        .pipe(
            gulp.dest('builds/development/css/')
        )
        .pipe(
            connect.reload()
        );
});

// watch any dynamic file changes
gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});


// set up browser live reload
gulp.task('connect', function() {
    connect.server({
        root: 'builds/development/',
        livereload: true
    });
});

// set upt live reload for static files, eg. HTML
gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(
            connect.reload()
        )
});

gulp.task('json', function() {
    gulp.src(jsonSources)
        .pipe(
            connect.reload()
        )
});

// include all tasks in the default task
gulp.task('default', ['coffee', 'js', 'compass', 'html', 'json', 'connect', 'watch']);