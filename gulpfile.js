var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    minifyJSON = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat');

// add environment variables
var env, coffeeSources, jsSources, sassSources, htmlSources, jsonSources, outputDir, sassStyle;

env = process.env.NODE_ENV || 'development';

if(env === 'development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = "nested";
}

coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = ['components/scripts/tagline.js',
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js', 
    'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

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
            gulpif(env === 'production', uglify())
        )
		.pipe(
			gulp.dest(outputDir + 'js/')
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
                image: outputDir + 'images/',
                style: sassStyle
            })
            .on('error', gutil.log)
        )
        .pipe(
            gulp.dest(outputDir + 'css/')
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
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
    gulp.watch(jsonSources, ['json']);
    gulp.watch('builds/development/images/**/*.*', ['images']);
});


// set up browser live reload
gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

// set upt live reload for static files, eg. HTML
gulp.task('html', function() {
    gulp.src('builds/development/*.html')
        .pipe(
            gulpif(env === 'production', minifyHTML())
        )
        .pipe(
            gulpif(env === 'production', gulp.dest(outputDir))
        )
        .pipe(
            connect.reload()
        )
});

gulp.task('images', function() {
    gulp.src('builds/development/images/**/*.*')
        .pipe(
            gulpif(env === 'production', imagemin())
        )
        .pipe(
            gulpif(env === 'production', gulp.dest(outputDir + 'images'))
        )
        .pipe(
            connect.reload()
        )
});

gulp.task('json', function() {
    gulp.src('builds/development/js/*.json')
        .pipe(
            gulpif(env === 'production', minifyJSON())
        )
        .pipe(
            gulpif(env === 'production', gulp.dest(outputDir + 'js'))
        )
        .pipe(
            connect.reload()
        )
});

// include all tasks in the default task
gulp.task('default', ['coffee', 'js', 'compass', 'html', 'images', 'json', 'connect', 'watch']);