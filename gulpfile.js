var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var webserver = require('gulp-webserver');
var env = process.env.GULP_ENV;

gulp.task('jshint', function() {
    return gulp
        .src([
            'resources/front/js/**/*.js',
            'resources/front/js/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
    ;
});

gulp.task('build-less', function() {
    var vendorsFiles = mainBowerFiles();
    var appFiles = [
        'resources/frontless/bootstrap.less'
    ];
    var files = vendorsFiles.concat(appFiles);
    return gulp
        .src(files)
        .pipe(filter(['**/*.css', '**/*.less']))
        .pipe(less())
        .pipe(concat('style.min.css'))
        .pipe(gulpif(env === 'prod', uglifycss()))
        .pipe(gulp.dest('www/'))
    ;
});

gulp.task('build-js', function() {
    var vendorsFiles = mainBowerFiles();
    var appFiles = [
        'resources/frontjs/app.js',
        'resources/frontjs/*.js',
        'resources/frontjs/**/*.js',
        'bower_components/fullcalendar/dist/lang/fr.js'
    ];
    var files = ['bower_components/jquery/dist/jquery.js'].concat(vendorsFiles.concat(appFiles));
    return gulp
        .src(files)
        .pipe(filter(['**/*.js']))
        .pipe(concat('app.min.js'))
        .pipe(gulpif(env === 'prod', uglify()))
        .pipe(gulp.dest('www/'))
    ;
});

gulp.task('lint-js', function() {
    var appFiles = [
        'resources/frontjs/app.js',
        'resources/frontjs/*.js',
        'resources/frontjs/**/*.js',
    ];
    return gulp
        .src(appFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
    ;
});

gulp.task('copy-fonts', function () {
    return gulp.src(mainBowerFiles().concat('public/bower/font-awesome/fonts/*'))
        .pipe(filter(['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff', '**/*.woff2', '**/*.otf']))
        .pipe(gulp.dest('www/fonts/'));
});

gulp.task('serve', function() {
    gulp
        .src( 'www' )
        .pipe(webserver({
            host: '0.0.0.0',
            port: process.env.PORT || 9001,
            livereload: false,
            directoryListing: false
        }))
    ;
});

gulp.task('watch', function() {
    gulp.watch(['resources/frontjs/**/*.js', 'resources/frontjs/*.js'], ['lint-js', 'build-js']);
    gulp.watch('resources/frontless/*.less', ['build-less']);
});
gulp.task('build', ['build-js', 'build-less', 'copy-fonts']);
gulp.task('start', ['watch', 'serve']);
gulp.task('default', ['build', 'start']);
